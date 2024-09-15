import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, UserPlus, Save, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Datepicker from 'react-tailwindcss-datepicker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { fieldNames, fieldLabels, dateFields, dialogOptions } from '@/constants/studentFormConstants'
import { studentSchema } from '@/schemas/studentSchema'
import { formatLabel, sanitizeValue } from '@/utils/studentFormUtils'
import { z } from 'zod'  // Add this import

const StudentFormPage = () => {
  const [formData, setFormData] = useState(
    fieldNames.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  )
  const [openDialog, setOpenDialog] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()
  const { studentId } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (studentId && location.state?.student) {
      console.log('Initializing form with student data:', location.state.student);
      setFormData(location.state.student)
    } else if (studentId) {
      console.log('Fetching student data for ID:', studentId);
      fetchStudentData(studentId);
    }
  }, [studentId, location.state])

  const fetchStudentData = async (id) => {
    try {
      const student = await window.api.getStudent(id);
      console.log('Fetched student data:', student);
      if (student) {
        setFormData(student);
      } else {
        console.error('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const sanitizedValue = sanitizeValue(id, value);
    setFormData({ ...formData, [id]: sanitizedValue });
  }

  const validateForm = () => {
    try {
      const formDataWithDates = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        dateOfAdmission: formData.dateOfAdmission ? new Date(formData.dateOfAdmission) : undefined,
      }
      studentSchema.parse(formDataWithDates)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {}
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleDateChange = (field, value) => {
    setFormData({ ...formData, [field]: value.startDate ? new Date(value.startDate) : null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const updatedFormData = {
        ...formData,
        lastUpdated: new Date().toISOString()
      };
      if (studentId) {
        console.log('Updating student with ID:', studentId);
        console.log('Updated data:', updatedFormData);
        const updatedStudent = await window.api.updateStudent(studentId, updatedFormData)
        console.log('Student updated successfully:', updatedStudent)
      } else {
        console.log('Adding new student');
        console.log('New student data:', updatedFormData);
        const newStudent = await window.api.addStudent(updatedFormData)
        console.log('New student added successfully:', newStudent)
      }
      navigate('/table')
    } catch (error) {
      console.error(`Error ${studentId ? 'updating' : 'adding'} student:`, error)
    }
  }

  const handleBack = () => {
    navigate('/table')
  }

  const handleOptionSelect = (field, value) => {
    setFormData({ ...formData, [field]: value })
    setOpenDialog('')
    setSearchTerm('')
  }

  const handleCustomSubmit = () => {
    setFormData({ ...formData, [openDialog]: customValue })
    setOpenDialog('')
    setCustomValue('')
    setSearchTerm('')
  }

  const filteredOptions = (field) => {
    return dialogOptions[field].filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <header className="bg-gray-800 text-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">New Student Registration</h1>
          <div className="flex space-x-4">
            <Button onClick={handleBack} >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              {studentId ? <Save className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {studentId ? 'Update' : 'Add'} Student
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow p-6 overflow-hidden">
        <Card className="max-w-4xl mx-auto h-full flex flex-col">
          <CardContent className="flex-grow overflow-hidden">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <ScrollArea className="flex-grow pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {fieldNames.map((field) => (
                    <div key={field}>
                      <Label htmlFor={field} className="text-sm font-medium">
                        {formatLabel(field, fieldLabels)}
                      </Label>
                      {dateFields.includes(field) ? (
                        <Datepicker
                          asSingle={true}
                          useRange={false}
                          value={{
                            startDate: formData[field] ? new Date(formData[field]) : null,
                            endDate: formData[field] ? new Date(formData[field]) : null
                          }}
                          onChange={(value) => handleDateChange(field, value)}
                          displayFormat="DD-MM-YYYY"
                          placeholder={`Select ${formatLabel(field, fieldLabels)}`}
                          inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      ) : dialogOptions[field] ? (
                        <div className="flex space-x-2">
                          <Input
                            id={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            className="flex-grow"
                          />
                          <Dialog
                            open={openDialog === field}
                            onOpenChange={(open) => setOpenDialog(open ? field : '')}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">Select</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Select {formatLabel(field, fieldLabels)}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Search className="w-4 h-4 opacity-50" />
                                  <Input
                                    placeholder={`Search ${formatLabel(field, fieldLabels)}`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1"
                                  />
                                </div>
                                <ScrollArea className="h-[300px] pr-4">
                                  <div className="space-y-2">
                                    {filteredOptions(field).map((option, index) => (
                                      <Button
                                        key={index}
                                        onClick={() => handleOptionSelect(field, option)}
                                        variant="outline"
                                        className={`w-full justify-start ${formData[field] === option ? 'bg-primary text-primary-foreground' : ''}`}
                                      >
                                        {option}
                                      </Button>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <div className="pt-4 border-t">
                                  <Label htmlFor="customValue">Custom {formatLabel(field, fieldLabels)}</Label>
                                  <div className="flex space-x-2 mt-2">
                                    <Input
                                      id="customValue"
                                      value={customValue}
                                      onChange={(e) => setCustomValue(e.target.value)}
                                      placeholder={`Enter custom ${formatLabel(field, fieldLabels)}`}
                                    />
                                    <Button onClick={handleCustomSubmit}>Add</Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <Input
                          id={field}
                          value={formData[field]}
                          onChange={handleChange}
                          required={!['caste', 'subCaste', 'taluka', 'lastAttendedSchool', 'lastSchoolStandard', 'studentId', 'PENNo', 'GRN'].includes(field)}
                          className={`mt-1 ${errors[field] ? 'border-red-500' : ''}`}
                          maxLength={field === 'aadharNo' ? 12 : field === 'PENNo' ? 11 : undefined}
                          pattern={
                            field === 'aadharNo' ? "\\d{12}" :
                            field === 'PENNo' ? "\\d{11}" :
                            ['studentId', 'GRN'].includes(field) ? "\\d+" :
                            ['name', 'surname', 'fathersName', 'mothersName'].includes(field) ? "[a-zA-Z\\s]+" :
                            undefined
                          }
                          title={
                            field === 'aadharNo' ? "Aadhar Number must be exactly 12 digits" :
                            field === 'PENNo' ? "PEN Number must be exactly 11 digits" :
                            ['studentId', 'GRN'].includes(field) ? "Must be numeric" :
                            ['name', 'surname', 'fathersName', 'mothersName'].includes(field) ? "Must contain only letters and spaces" :
                            undefined
                          }
                        />
                      )}
                      {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default StudentFormPage
