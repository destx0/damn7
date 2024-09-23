import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Datepicker from 'react-tailwindcss-datepicker'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'

const BonafideForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pdfDataUrl, studentData: initialStudentData } = location.state || {}

  const [studentData, setStudentData] = useState(initialStudentData || {})
  const [formData, setFormData] = useState({
    academicYear: '',
    reasonOfBonafide: '',
    requestOfBonafideBy: '',
    dateOfBonafide: '',
    currentStandardForBonafide: '',
    bonafideStandard: '',
    otherReason: ''
  })
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)
  const [isStandardDialogOpen, setIsStandardDialogOpen] = useState(false)
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState('')
  const [selectedReason, setSelectedReason] = useState('')
  const [generatedCount, setGeneratedCount] = useState(0)

  const standardOptions = ['V', 'VI', 'VII', 'VIII', 'IX', 'X']
  const reasonOptions = [
    'For Passport',
    'For Scholarship',
    'For Bank Account',
    'For Admission',
    'Other'
  ]

  useEffect(() => {
    loadStudentData()
    loadGeneratedCount()
  }, [])

  const loadStudentData = async () => {
    try {
      if (initialStudentData && initialStudentData.studentId) {
        const student = await window.api.getStudent(initialStudentData.studentId)
        setStudentData(student)
        setFormData((prevData) => ({
          ...prevData,
          ...student,
          otherReason: student.otherReason || ''
        }))
      } else {
        console.error('Student data or studentId is undefined')
      }
    } catch (error) {
      console.error('Error loading student data:', error)
    }
  }

  const loadGeneratedCount = async () => {
    try {
      const count = await window.api.getBonafideGeneratedCount(studentData.studentId)
      setGeneratedCount(count)
    } catch (error) {
      console.error('Error loading generated count:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value ?? ''
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

      // Check if data has changed
      const hasDataChanged = Object.keys(formData).some((key) => formData[key] !== studentData[key])

      if (hasDataChanged) {
        certificateData.lastUpdated = new Date().toISOString()
      }

      const base64Data = await window.api.generateOfficialBonafideCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)

      // Update the generated count
      const newCount = await window.api.getBonafideGeneratedCount(studentData.studentId)
      setGeneratedCount(newCount)

      // Update student data in the students table only if data has changed
      if (hasDataChanged) {
        const updatedStudent = await window.api.updateStudent(studentData.studentId, {
          ...formData,
          lastUpdated: new Date().toISOString()
        })
        setStudentData(updatedStudent)
      }
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
    }
  }

  const refreshDraftCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        ...formData
      }
      const base64Data = await window.api.generateDraftBonafideCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)
    } catch (error) {
      console.error('Error refreshing draft bonafide certificate:', error)
    }
  }

  const handleStandardSelect = (standard) => {
    setSelectedStandard(standard)
  }

  const handleConfirmStandard = () => {
    setFormData((prevData) => ({
      ...prevData,
      currentStandardForBonafide: selectedStandard,
      bonafideStandard: selectedStandard
    }))
    setIsStandardDialogOpen(false)
  }

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason)
  }

  const handleConfirmReason = () => {
    if (selectedReason === 'Other') {
      setFormData((prevData) => ({
        ...prevData,
        reasonOfBonafide: formData.otherReason || '',
        otherReason: formData.otherReason || ''
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        reasonOfBonafide: selectedReason,
        otherReason: ''
      }))
    }
    setIsReasonDialogOpen(false)
  }

  const formFields = [
    { name: 'academicYear', label: 'Academic Year', type: 'text' },
    { name: 'currentStandardForBonafide', label: 'Current Standard for Bonafide', type: 'text' },
    { name: 'bonafideStandard', label: 'Bonafide Standard', type: 'text' },
    { name: 'dateOfBonafide', label: 'Date of Bonafide', type: 'date' },
    { name: 'reasonOfBonafide', label: 'Reason of Bonafide', type: 'textarea' },
    { name: 'requestOfBonafideBy', label: 'Request of Bonafide By', type: 'text' }
  ]

  const renderField = (field) => {
    switch (field.name) {
      case 'currentStandardForBonafide':
      case 'bonafideStandard':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly={
                field.name === 'currentStandardForBonafide' || field.name === 'bonafideStandard'
              }
            />
            <Dialog open={isStandardDialogOpen} onOpenChange={setIsStandardDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Standard</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {standardOptions.map((standard, index) => (
                    <Button
                      key={index}
                      onClick={() => handleStandardSelect(standard)}
                      variant="outline"
                      className={`w-full justify-start ${selectedStandard === standard ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {standard}
                    </Button>
                  ))}
                </div>
                <Button onClick={handleConfirmStandard} className="w-full mt-4">
                  Confirm Standard
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 'reasonOfBonafide':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly={field.name === 'reasonOfBonafide'}
            />
            <Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Reason of Bonafide</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {reasonOptions.map((reason, index) => (
                    <Button
                      key={index}
                      onClick={() => handleReasonSelect(reason)}
                      variant="outline"
                      className={`w-full justify-start ${selectedReason === reason ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
                {selectedReason === 'Other' && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="otherReason">Other Reason</Label>
                    <Input
                      id="otherReason"
                      name="otherReason"
                      value={formData.otherReason || ''}
                      onChange={handleInputChange}
                      placeholder="Enter other reason"
                    />
                  </div>
                )}
                <Button onClick={handleConfirmReason} className="w-full mt-4">
                  Confirm Reason
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
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
            displayFormat="DD-MM-YYYY"
            placeholder={`Select ${field.label.toLowerCase()}`}
            inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        )
    }
  }

  const closeCertificate = () => {
    navigate('/table')
  }

  const handleSave = async () => {
    try {
      // Check if data has changed
      const hasDataChanged = Object.keys(formData).some((key) => formData[key] !== studentData[key])

      if (hasDataChanged) {
        const updatedData = {
          ...formData,
          lastUpdated: new Date().toISOString()
        }
        await window.api.updateStudent(studentData.studentId, updatedData)
        toast.success('Student data saved successfully')
        // Update the local studentData state
        setStudentData((prevData) => ({ ...prevData, ...updatedData }))
      } else {
        toast.success('No changes to save')
      }

      // Navigate to the table page after saving
      navigate('/table')
    } catch (error) {
      console.error('Error saving student data:', error)
      toast.error('Failed to save student data')
    }
  }

  return (
    <>
      <div className="flex justify-between m-4">
        <h2 className="text-xl font-semibold ">Bonafide Certificate Form </h2>
        <Button onClick={generateOfficialCertificate}>Generate Official Certificate</Button>
        <Button onClick={refreshDraftCertificate} variant="secondary">
          Refresh Draft
        </Button>
        <Button onClick={handleSave} variant="outline">
          Save
        </Button>
        <Button onClick={closeCertificate} variant="outline">
          Close
        </Button>
      </div>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg border">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="p-4 h-full flex flex-col">
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
              title="Bonafide Certificate PDF"
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}

export default BonafideForm
