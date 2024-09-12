import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, UserPlus, Save, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Datepicker from 'react-tailwindcss-datepicker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const fieldNames = [
  'studentId',
  'aadharNo',
  'PENNo',
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
  'admissionStandard',
  'nationality',
  'motherTongue'
]

const fieldLabels = {
  studentId: 'Student ID',
  aadharNo: 'Aadhar Number',
  PENNo: 'PEN Number',
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
  admissionStandard: 'Admission Standard',
  nationality: 'Nationality',
  motherTongue: 'Mother Tongue'
}

const dateFields = ['dateOfBirth', 'dateOfAdmission']

const dialogOptions = {
  religion: ['Hindu', 'Islam', 'Christianity', 'Sikhism', 'Buddhism'],
  state: [
    'Maharashtra',
    'Gujarat',
    'Madhya Pradesh',
    'Goa',
    'Karnataka',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Kerala',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ],
  district: [
    'Jalgaon',
    'Mumbai City',
    'Mumbai Suburban',
    'Pune',
    'Thane',
    'Nagpur',
    'Nashik',
    'Aurangabad',
    'Solapur',
    'Amravati',
    'Kolhapur',
    'Latur',
    'Akola',
    'Chandrapur',
    'Parbhani',
    'Yavatmal',
    'Satara',
    'Sangli',
    'Wardha',
    'Beed',
    'Bhandara',
    'Buldhana',
    'Dhule',
    'Gadchiroli',
    'Gondia',
    'Hingoli',
    'Jalna',
    'Nanded',
    'Nandurbar',
    'Osmanabad',
    'Raigad',
    'Ratnagiri',
    'Sindhudurg',
    'Washim'
  ],
  nationality: ['Indian'],
  admissionStandard: ['V', 'VI', 'VII', 'VIII', 'IX', 'X'],
  lastSchoolStandard: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
  motherTongue: ['Marathi', 'Hindi', 'English', 'Gujarati', 'Urdu']
}

// Define the Zod schema
const studentSchema = z.object({
  studentId: z.string().regex(/^\d+$/, { message: "Student ID must be numeric" }).optional(),
  aadharNo: z.string().regex(/^\d{12}$/, { message: "Aadhar Number must be exactly 12 digits" }),
  PENNo: z.string().regex(/^\d{11}$/, { message: "PEN Number must be exactly 11 digits" }).optional(),
  GRN: z.string().regex(/^\d+$/, { message: "GRN must be numeric" }).optional(),
  name: z.string().regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters and spaces" }).min(1, { message: "Name is required" }),
  surname: z.string().regex(/^[a-zA-Z\s]+$/, { message: "Surname must contain only letters and spaces" }).min(1, { message: "Surname is required" }),
  fathersName: z.string().regex(/^[a-zA-Z\s]+$/, { message: "Father's Name must contain only letters and spaces" }).min(1, { message: "Father's Name is required" }),
  mothersName: z.string().regex(/^[a-zA-Z\s]+$/, { message: "Mother's Name must contain only letters and spaces" }).min(1, { message: "Mother's Name is required" }),
  religion: z.string().min(1, { message: "Religion is required" }),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  placeOfBirth: z.string().min(1, { message: "Place of Birth is required" }),
  taluka: z.string().optional(),
  district: z.string().min(1, { message: "District is required" }),
  state: z.string().min(1, { message: "State is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of Birth is required" }),
  lastAttendedSchool: z.string().optional(),
  lastSchoolStandard: z.string().optional(),
  dateOfAdmission: z.string().min(1, { message: "Date of Admission is required" }),
  admissionStandard: z.string().min(1, { message: "Admission Standard is required" }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  motherTongue: z.string().min(1, { message: "Mother Tongue is required" })
})

const StudentFormPage = () => {
  const [formData, setFormData] = useState(
    fieldNames.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  )
  const [openDialog, setOpenDialog] = useState('')
  const [customValue, setCustomValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  const { studentId } = useParams()
  const location = useLocation()

  const [errors, setErrors] = useState({})

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
        // Handle the case when student is not found
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let sanitizedValue = value;

    if (['studentId', 'aadharNo', 'PENNo', 'GRN'].includes(id)) {
      // Allow only digits
      sanitizedValue = value.replace(/\D/g, '');
      if (id === 'PENNo') {
        sanitizedValue = sanitizedValue.slice(0, 11);
      } else if (id === 'aadharNo') {
        sanitizedValue = sanitizedValue.slice(0, 12);
      }
    } else if (['name', 'surname', 'fathersName', 'mothersName'].includes(id)) {
      // Allow only letters and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData({ ...formData, [id]: sanitizedValue });
  }

  const validateForm = () => {
    try {
      studentSchema.parse(formData)
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
    setFormData({ ...formData, [field]: value.startDate })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      if (studentId) {
        console.log('Updating student with ID:', studentId);
        console.log('Updated data:', formData);
        const updatedStudent = await window.api.updateStudent(studentId, formData)
        console.log('Student updated successfully:', updatedStudent)
      } else {
        console.log('Adding new student');
        console.log('New student data:', formData);
        const newStudent = await window.api.addStudent(formData)
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

  const formatLabel = (field) => {
    return (
      fieldLabels[field] ||
      field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    )
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
                        {formatLabel(field)}
                      </Label>
                      {dateFields.includes(field) ? (
                        <Datepicker
                          asSingle={true}
                          useRange={false}
                          value={{ startDate: formData[field], endDate: formData[field] }}
                          onChange={(value) => handleDateChange(field, value)}
                          displayFormat="DD-MM-YYYY"
                          placeholder={`Select ${formatLabel(field)}`}
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
                                <DialogTitle>Select {formatLabel(field)}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Search className="w-4 h-4 opacity-50" />
                                  <Input
                                    placeholder={`Search ${formatLabel(field)}`}
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
                                  <Label htmlFor="customValue">Custom {formatLabel(field)}</Label>
                                  <div className="flex space-x-2 mt-2">
                                    <Input
                                      id="customValue"
                                      value={customValue}
                                      onChange={(e) => setCustomValue(e.target.value)}
                                      placeholder={`Enter custom ${formatLabel(field)}`}
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
