import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Datepicker from 'react-tailwindcss-datepicker'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

const LeaveForm = ({ studentData, pdfDataUrl, closeCertificate, onStudentUpdate }) => {
  const [formData, setFormData] = useState({
    currentStandard: '',
    progress: '',
    conduct: '',
    dateOfLeaving: '',
    reasonOfLeaving: '',
    remarks: '',
    leaveCertificateGenerationDate: ''
  })
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      if (studentData && studentData.studentId) {
        const student = await window.api.getStudent(studentData.studentId)
        setFormData((prevData) => ({
          ...prevData,
          ...student
        }))
      } else {
        console.error('Student data or studentId is undefined')
      }
    } catch (error) {
      console.error('Error loading student data:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.startDate
    }))
  }

  const generateOfficialCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        ...formData
      }
      const base64Data = await window.api.generateOfficialLeaveCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)

      // Update student data in the students table
      await window.api.updateStudent(studentData.studentId, formData)
      onStudentUpdate({ ...studentData, ...formData })
    } catch (error) {
      console.error('Error generating official leave certificate:', error)
    }
  }

  const formFields = [
    { name: 'currentStandard', label: 'Current Standard', type: 'text' },
    { name: 'progress', label: 'Progress', type: 'text' },
    { name: 'conduct', label: 'Conduct', type: 'text' },
    { name: 'dateOfLeaving', label: 'Date of Leaving', type: 'date' },
    { name: 'reasonOfLeaving', label: 'Reason of Leaving', type: 'textarea' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' },
    {
      name: 'leaveCertificateGenerationDate',
      label: 'Leave Certificate Generation Date',
      type: 'date'
    }
  ]

  const renderField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        )
      case 'date':
        return (
          <Datepicker
            asSingle={true}
            useRange={false}
            value={{ startDate: formData[field.name], endDate: formData[field.name] }}
            onChange={(value) => handleDateChange(field.name, value)}
            displayFormat="YYYY-MM-DD"
            placeholder={`Select ${field.label.toLowerCase()}`}
            inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        )
    }
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg border">
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="p-4 h-full flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Leave Certificate Form</h2>
          <div className="flex justify-between mb-4">
            <Button onClick={generateOfficialCertificate}>Generate Official Certificate</Button>
            <Button onClick={closeCertificate} variant="outline">
              Close
            </Button>
          </div>
          <div className="space-y-4 flex-grow overflow-y-auto">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full p-4">
          <iframe
            src={currentPdfUrl}
            className="w-full h-full border-none"
            title="Leave Certificate PDF"
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default LeaveForm
