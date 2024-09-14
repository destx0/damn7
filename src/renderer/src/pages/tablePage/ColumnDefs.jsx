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
  {
    headerName: '',
    cellRenderer: (params) => (
      <ActionMenu
        isAdmin={isAdmin}
        onEdit={() => handleEditStudent(params.data)}
        onDelete={() => handleDeleteStudent(params.data.studentId)}
        onLeaveCertificate={() => generateDraftCertificate(params.data, 'leave')}
        onBonafideCertificate={() => generateDraftCertificate(params.data, 'bonafide')}
      />
    ),
    pinned: 'left',
    width: 30,
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
  },
  { headerName: 'Student ID', field: 'studentId', pinned: 'left', width: 120 },
  { headerName: 'GRN', field: 'GRN', pinned: 'left', width: 80 },
  { headerName: 'PEN No', field: 'PENNo' },
  { headerName: 'Aadhar No', field: 'aadharNo' },
  { headerName: 'Name', field: 'name' },
  { headerName: 'Surname', field: 'surname' },
  { headerName: "Father's Name", field: 'fathersName' },
  { headerName: "Mother's Name", field: 'mothersName' },
  { headerName: 'Religion', field: 'religion' },
  { headerName: 'Caste', field: 'caste' },
  { headerName: 'Sub Caste', field: 'subCaste' },
  { headerName: 'Place of Birth', field: 'placeOfBirth' },
  { headerName: 'Taluka', field: 'taluka' },
  { headerName: 'District', field: 'district' },
  { headerName: 'State', field: 'state' },
  { headerName: 'Date of Birth', field: 'dateOfBirth', filter: 'agDateColumnFilter' },
  { headerName: 'Last Attended School', field: 'lastAttendedSchool' },
  { headerName: 'Last School Standard', field: 'lastSchoolStandard' },
  { headerName: 'Date of Admission', field: 'dateOfAdmission', filter: 'agDateColumnFilter' },
  { headerName: 'Admission Standard', field: 'admissionStandard' },
  { headerName: 'Nationality', field: 'nationality', hide: true },
  { headerName: 'Mother Tongue', field: 'motherTongue' },
  { headerName: 'Current Standard', field: 'currentStandard', hide: true },
  { headerName: 'Progress', field: 'progress', hide: true },
  { headerName: 'Conduct', field: 'conduct', hide: true },
  { headerName: 'Date of Leaving', field: 'dateOfLeaving', filter: 'agDateColumnFilter', hide: true },
  { headerName: 'Reason of Leaving', field: 'reasonOfLeaving', hide: true },
  { headerName: 'Remarks', field: 'remarks', hide: true },
  { headerName: 'Leave Certificate Date', field: 'leaveCertificateGenerationDate', filter: 'agDateColumnFilter', hide: true },
  { headerName: 'SSC Exam Year', field: 'sscExamYear', hide: true },
  { headerName: 'SSC Pass Status', field: 'sscPassStatus', hide: true },
  { headerName: 'Academic Year', field: 'academicYear', hide: true },
  { headerName: 'Bonafide Reason', field: 'reasonOfBonafide', hide: true },
  { headerName: 'Bonafide Requested By', field: 'requestOfBonafideBy', hide: true },
  { headerName: 'Bonafide Date', field: 'dateOfBonafide', filter: 'agDateColumnFilter', hide: true },
  { headerName: 'Bonafide Standard', field: 'bonafideStandard', hide: true }
]

export { createColumnDefs, ActionMenu }
