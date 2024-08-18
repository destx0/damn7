import React from 'react'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const ActionMenu = ({ isAdmin, onEdit, onDelete, onLeaveCertificate, onBonafideCertificate }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={onLeaveCertificate}>Leave Certificate</DropdownMenuItem>
        <DropdownMenuItem onClick={onBonafideCertificate}>Bonafide Certificate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const createColumnDefs = (
  isAdmin,
  handleEditStudent,
  handleDeleteStudent,
  generateDraftCertificate
) => [
  { headerName: 'Student ID', field: 'studentId', filter: 'agTextColumnFilter' },
  { headerName: 'Aadhar No', field: 'aadharNo', filter: 'agTextColumnFilter' },
  { headerName: 'Name', field: 'name', filter: 'agTextColumnFilter' },
  { headerName: 'Surname', field: 'surname', filter: 'agTextColumnFilter' },
  { headerName: "Father's Name", field: 'fathersName', filter: 'agTextColumnFilter' },
  { headerName: "Mother's Name", field: 'mothersName', filter: 'agTextColumnFilter' },
  { headerName: 'Religion', field: 'religion', filter: 'agTextColumnFilter' },
  { headerName: 'Caste', field: 'caste', filter: 'agTextColumnFilter' },
  { headerName: 'Sub Caste', field: 'subCaste', filter: 'agTextColumnFilter' },
  { headerName: 'Place of Birth', field: 'placeOfBirth', filter: 'agTextColumnFilter' },
  { headerName: 'Taluka', field: 'taluka', filter: 'agTextColumnFilter' },
  { headerName: 'District', field: 'district', filter: 'agTextColumnFilter' },
  { headerName: 'State', field: 'state', filter: 'agTextColumnFilter' },
  { headerName: 'Date of Birth', field: 'dateOfBirth', filter: 'agDateColumnFilter' },
  { headerName: 'Last Attended School', field: 'lastAttendedSchool', filter: 'agTextColumnFilter' },
  { headerName: 'Last School Standard', field: 'lastSchoolStandard', filter: 'agTextColumnFilter' },
  { headerName: 'Date of Admission', field: 'dateOfAdmission', filter: 'agDateColumnFilter' },
  { headerName: 'Admission Standard', field: 'admissionStandard', filter: 'agTextColumnFilter' },
  {
    headerName: 'Actions',
    cellRenderer: (params) => (
      <ActionMenu
        isAdmin={isAdmin}
        onEdit={() => handleEditStudent(params.data)}
        onDelete={() => handleDeleteStudent(params.data.id)}
        onLeaveCertificate={() => generateDraftCertificate(params.data, 'leave')}
        onBonafideCertificate={() => generateDraftCertificate(params.data, 'bonafide')}
      />
    )
  }
]

export { createColumnDefs, ActionMenu }
