import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const selectedColumns = [
  { field: 'GRN', header: 'GRN' },
  { field: 'name', header: 'Name' },
  { field: 'fathersName', header: "Father's Name" },
  { field: 'surname', header: 'Surname' },
  { field: 'mothersName', header: "Mother's Name" },
  { field: 'caste', header: 'Caste' }
]

export const exportToPDF = (gridApi) => {
  if (!gridApi) {
    console.error('Grid API is not available')
    return
  }

  const doc = new jsPDF('landscape')

  // Get only filtered & sorted data
  const filteredRowData = []
  gridApi.forEachNodeAfterFilterAndSort(node => {
    if (node.data) {
      const rowDataItem = {}
      selectedColumns.forEach(column => {
        rowDataItem[column.field] = node.data[column.field]
      })
      filteredRowData.push(rowDataItem)
    }
  })

  // If no data after filtering, show message
  if (filteredRowData.length === 0) {
    doc.setFontSize(14)
    doc.text('No records found matching the filter criteria.', 14, 30)
    doc.save('student_records.pdf')
    return
  }

  // Add title and date with filter info
  doc.setFontSize(18)
  doc.text('Student Records', 14, 15)
  doc.setFontSize(10)
  const currentDate = new Date().toLocaleDateString()
  doc.text(`Generated on: ${currentDate}`, 14, 22)
  doc.text(`Total Records: ${filteredRowData.length}`, 14, 27)

  // Sort by GRN
  filteredRowData.sort((a, b) => a.GRN.localeCompare(b.GRN))

  // Split data into chunks of 20 records
  const chunkSize = 20
  const chunks = []
  for (let i = 0; i < filteredRowData.length; i += chunkSize) {
    chunks.push(filteredRowData.slice(i, i + chunkSize))
  }

  // Create tables for each chunk
  let startY = 35 // Adjusted to accommodate the new text
  chunks.forEach((chunk, index) => {
    if (index > 0) {
      doc.addPage()
      startY = 30
      doc.setFontSize(18)
      doc.text('Student Records (Continued)', 14, 15)
      doc.setFontSize(10)
      doc.text(`Page ${index + 1} of ${chunks.length}`, 14, 22)
    }

    doc.autoTable({
      startY: startY,
      head: [selectedColumns.map(column => column.header)],
      body: chunk.map(row => selectedColumns.map(column => row[column.field])),
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold'
      },
      didDrawPage: function(data) {
        // Add page number at the bottom
        doc.setFontSize(8)
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${chunks.length}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        )
      }
    })
  })

  // Save the PDF with a more descriptive name including the date
  const fileName = `student_records_${currentDate.replace(/\//g, '-')}.pdf`
  doc.save(fileName)
}
