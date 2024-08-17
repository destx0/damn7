import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

const StudentFormPage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    aadharNo: '',
    name: '',
    surname: '',
    fathersName: '',
    mothersName: '',
    religion: '',
    caste: '',
    subCaste: '',
    placeOfBirth: '',
    taluka: '',
    district: '',
    state: '',
    dateOfBirth: '',
    lastAttendedSchool: '',
    lastSchoolStandard: '',
    dateOfAdmission: '',
    admissionStandard: ''
  })

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit' : 'Add'} Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
            <Input
              id={key}
              value={value}
              onChange={handleChange}
              required
              type={key === 'dateOfBirth' || key === 'dateOfAdmission' ? 'date' : 'text'}
            />
          </div>
        ))}
        <Button type="submit">{id ? 'Update' : 'Add'} Student</Button>
        <Button type="button" onClick={() => navigate('/table')} variant="secondary">
          Cancel
        </Button>
      </form>
    </div>
  )
}

export default StudentFormPage
