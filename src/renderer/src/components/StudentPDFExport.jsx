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

  // Add title and date
  doc.setFontSize(18)
  doc.text('Student Records', 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

  // Get grid data and sort by GRN
  const allRowData = []
  gridApi.forEachNodeAfterFilterAndSort(node => {
    if (node.data) {
      const rowDataItem = {}
      selectedColumns.forEach(column => {
        rowDataItem[column.field] = node.data[column.field]
      })
      allRowData.push(rowDataItem)
    }
  })

  // Sort by GRN
  allRowData.sort((a, b) => a.GRN.localeCompare(b.GRN))

  // Split data into chunks of 20 records
  const chunkSize = 20
  const chunks = []
  for (let i = 0; i < allRowData.length; i += chunkSize) {
    chunks.push(allRowData.slice(i, i + chunkSize))
  }

  // Create tables for each chunk
  let startY = 30
  chunks.forEach((chunk, index) => {
    if (index > 0) {
      // Add new page for subsequent chunks
      doc.addPage()
      // Reset startY for new page
      startY = 30
      // Add header to new page
      doc.setFontSize(18)
      doc.text('Student Records (Continued)', 14, 15)
      doc.setFontSize(10)
      doc.text(`Page ${index + 1} of ${chunks.length}`, 14, 22)
    }

    // Create the table for this chunk
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

  // Save the PDF
  doc.save('student_records.pdf')
}
