import React from 'react'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import ActionRenderer from '@/components/ActionRenderer'

const ActionMenu = ({
  isAdmin,
  onEdit,
  onDelete,
  onLeaveCertificate,
  onBonafideCertificate,
  onFreeze,
  onUnfreeze,
  data
}) => {
  return (
    <ActionRenderer
      data={data}
      onEdit={onEdit}
      onDelete={onDelete}
      onLeaveCertificate={() => onLeaveCertificate(data)}
      onBonafideCertificate={() => onBonafideCertificate(data)}
      onFreeze={onFreeze}
      onUnfreeze={onUnfreeze}
    />
  )
}

const createColumnDefs = (
  isAdmin,
  handleEditStudent,
  handleDeleteStudent,
  generateDraftCertificate,
  handleFreezeStudent,
  handleUnfreezeStudent
) => [
  {
    headerName: '',
    cellRenderer: (params) => (
      <ActionMenu
        isAdmin={isAdmin}
        data={params.data}
        onEdit={() => handleEditStudent(params.data)}
        onDelete={() => handleDeleteStudent(params.data.studentId)}
        onLeaveCertificate={() => generateDraftCertificate(params.data, 'leave')}
        onBonafideCertificate={() => generateDraftCertificate(params.data, 'bonafide')}
        onFreeze={() => handleFreezeStudent(params.data.studentId)}
        onUnfreeze={() => handleUnfreezeStudent(params.data.studentId)}
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
  { headerName: 'Current Standard', field: 'currentStandard' },
  { headerName: 'Progress', field: 'progress' },
  { headerName: 'Conduct', field: 'conduct' },
  {
    headerName: 'Date of Leaving',
    field: 'dateOfLeaving',
    filter: 'agDateColumnFilter'
  },
  { headerName: 'Reason of Leaving', field: 'reasonOfLeaving' },
  { headerName: 'Remarks', field: 'remarks' },
  {
    headerName: 'Leave Certificate Date',
    field: 'leaveCertificateGenerationDate',
    filter: 'agDateColumnFilter',
    hide: true
  },
  { headerName: 'SSC Exam Year', field: 'sscExamYear', hide: true },
  { headerName: 'SSC Pass Status', field: 'sscPassStatus', hide: true },
  { headerName: 'Academic Year', field: 'academicYear' },
  { headerName: 'Bonafide Reason', field: 'reasonOfBonafide', hide: true },
  { headerName: 'Bonafide Requested By', field: 'requestOfBonafideBy', hide: true },
  {
    headerName: 'Bonafide Date',
    field: 'dateOfBonafide',
    filter: 'agDateColumnFilter',
    hide: true
  },
  { headerName: 'Bonafide Standard', field: 'bonafideStandard', hide: true },
  {
    headerName: 'Bonafide Certificates Generated',
    field: 'bonafideGeneratedCount',
    width: 220,
    hide: true,
    valueGetter: (params) => {
      return params.data.bonafideGeneratedCount || 0
    }
  },
  {
    headerName: 'Leave Certificates Generated',
    field: 'leaveGeneratedCount',
    width: 220,
    valueGetter: (params) => {
      return params.data.leaveGeneratedCount || 0
    }
  },
  {
    headerName: 'Last Updated',
    field: 'lastUpdated',
    filter: 'agDateColumnFilter',
    valueFormatter: (params) => {
      if (params.value) {
        const date = new Date(params.value)
        return date.toLocaleString() // This will format the date and time
      }
      return ''
    }
  }
]

const getRowStyle = (params) => {
  if (params.data.isFrozen) {
    return { background: '#E6F3FF' } // Light blue background for frozen rows
  }
  return null // Default style for unfrozen rows
}

export { createColumnDefs, ActionMenu, getRowStyle }
