import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const fieldNames = [
  'studentId',
  'aadharNo',
  'PENNo',
  'UID',
  'GRN',
  'name',
  'surname',
  'fathersName',
  'mothersName',
  'religion',
  'caste',
  'subCaste',
  'placeOfBirth',
  'taluka',
  'district',
  'state',
  'dateOfBirth',
  'lastAttendedSchool',
  'lastSchoolStandard',
  'dateOfAdmission',
  'admissionStandard'
]

const fieldLabels = {
  studentId: 'Student ID',
  aadharNo: 'Aadhar Number',
  PENNo: 'PEN Number',
  UID: 'UID',
  GRN: 'GRN',
  name: 'Name',
  surname: 'Surname',
  fathersName: "Father's Name",
  mothersName: "Mother's Name",
  religion: 'Religion',
  caste: 'Caste',
  subCaste: 'Sub-caste',
  placeOfBirth: 'Place of Birth',
  taluka: 'Taluka',
  district: 'District',
  state: 'State',
  dateOfBirth: 'Date of Birth',
  lastAttendedSchool: 'Last Attended School',
  lastSchoolStandard: 'Last School Standard',
  dateOfAdmission: 'Date of Admission',
  admissionStandard: 'Admission Standard'
}

const StudentFormPage = () => {
  const [formData, setFormData] = useState(
    fieldNames.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  )

  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (id && location.state?.student) {
      setFormData(location.state.student)
    }
  }, [id, location.state])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await window.api.updateStudent(id, formData)
      } else {
        await window.api.addStudent(formData)
      }
      navigate('/table')
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} student:`, error)
    }
  }

  const handleBack = () => {
    navigate('/table')
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-grow overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{id ? 'Edit' : 'Add'} Student</h1>
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldNames.map((field) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-sm font-medium">
                    {fieldLabels[field]}
                  </Label>
                  <Input
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    type={field === 'dateOfBirth' || field === 'dateOfAdmission' ? 'date' : 'text'}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <Button type="button" onClick={handleBack} variant="outline">
                Cancel
              </Button>
              <Button type="submit">{id ? 'Update' : 'Add'} Student</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StudentFormPage
