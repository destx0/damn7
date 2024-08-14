import ActionRenderer from '@/components/ActionRenderer'

const createColumnDefs = (isAdmin, handleEditStudent, handleDeleteStudent, generateCertificate) => [
  { field: 'id', editable: false },
  { field: 'name', editable: isAdmin },
  { field: 'age', editable: isAdmin },
  { field: 'grade', editable: isAdmin },
  {
    headerName: 'Actions',
    cellRenderer: ActionRenderer,
    cellRendererParams: {
      onEdit: handleEditStudent,
      onDelete: handleDeleteStudent,
      onGenerateCertificate: generateCertificate
    },
    width: 100,
    sortable: false,
    filter: false
  }
]

export default createColumnDefs
