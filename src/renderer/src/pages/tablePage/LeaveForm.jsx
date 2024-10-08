import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { format, parse, isValid } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

const LeaveForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pdfDataUrl, studentData: initialStudentData } = location.state || {}

  const [studentData, setStudentData] = useState(initialStudentData || {})
  const [formData, setFormData] = useState({
    currentStandard: '',
    progress: '',
    conduct: '',
    dateOfLeaving: '',
    reasonOfLeaving: '',
    leaveCertificateGenerationDate: '',
    sscExamYear: '',
    sscPassStatus: '',
    otherReason: '',
    customRemarks: '',
    customProgress: '',
    customConduct: '',
    since: '',
    remarks: ''
  })
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false)
  const [isStandardDialogOpen, setIsStandardDialogOpen] = useState(false)
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false)
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [isConductDialogOpen, setIsConductDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [selectedStandard, setSelectedStandard] = useState('')
  const [selectedRemarks, setSelectedRemarks] = useState('')
  const [selectedProgress, setSelectedProgress] = useState('')
  const [selectedConduct, setSelectedConduct] = useState('')
  const [isSinceDialogOpen, setIsSinceDialogOpen] = useState(false)
  const [selectedSinceMonth, setSelectedSinceMonth] = useState('')
  const [selectedSinceYear, setSelectedSinceYear] = useState('')
  const [isSemi, setIsSemi] = useState(false)

  const predefinedReasons = [
    'Name struck off due to long absence',
    "Guardian's request",
    'Seat up for SSC exam at month of march',
    'Other'
  ]

  const standardOptions = ['V', 'VI', 'VII', 'VIII', 'IX', 'X']
  const remarksOptions = ['Dues nil', 'Custom']
  const progressOptions = ['Fair', 'Good', 'Excellent', 'Custom']
  const conductOptions = ['Fair', 'Good', 'Excellent', 'Custom']

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const formatDateString = (dateValue) => {
    if (!dateValue) return ''
    if (typeof dateValue === 'string') {
      // Try parsing as 'dd-MM-yyyy' first
      let date = parse(dateValue, 'dd-MM-yyyy', new Date())
      if (isValid(date)) {
        return format(date, 'dd-MM-yyyy')
      }
      // If parsing fails, try as ISO string
      date = new Date(dateValue)
      if (isValid(date)) {
        return format(date, 'dd-MM-yyyy')
      }
    } else if (dateValue instanceof Date && isValid(dateValue)) {
      return format(dateValue, 'dd-MM-yyyy')
    }
    return '' // Return empty string if parsing fails
  }

  useEffect(() => {
    loadStudentData()
  }, [])

  const loadStudentData = async () => {
    try {
      if (studentData && studentData.GRN) {
        const student = await window.api.getStudent(studentData.GRN)
        setStudentData(student)
        setFormData((prevData) => ({
          ...prevData,
          ...student,
          dateOfLeaving: formatDateString(student.dateOfLeaving),
          leaveCertificateGenerationDate: formatDateString(student.leaveCertificateGenerationDate)
        }))
      } else {
        console.error('Student data or GRN is undefined')
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

  const generateOfficialCertificate = async (isDuplicate = false) => {
    try {
      const certificateData = {
        ...studentData,
        ...formData,
        isDuplicate: isDuplicate
      }

      const hasDataChanged = Object.keys(formData).some((key) => formData[key] !== studentData[key])

      if (hasDataChanged) {
        certificateData.lastUpdated = format(new Date(), 'dd-MM-yyyy')
      }

      const base64Data = await window.api.generateOfficialLeaveCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)

      if (hasDataChanged) {
        await window.api.updateStudent(studentData.GRN, {
          ...formData,
          lastUpdated: format(new Date(), 'dd-MM-yyyy')
        })
      }
    } catch (error) {
      console.error('Error generating official leave certificate:', error)
    }
  }

  const generateDuplicateCertificate = () => {
    generateOfficialCertificate(true)
  }

  const refreshDraftCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        ...formData
      }
      const base64Data = await window.api.generateDraftLeaveCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)
    } catch (error) {
      console.error('Error refreshing draft leave certificate:', error)
    }
  }

  const handleStandardSelect = (standard) => {
    setSelectedStandard(standard)
  }

  const romanToOrdinal = {
    V: 'Fifth',
    VI: 'Sixth',
    VII: 'Seventh',
    VIII: 'Eighth',
    IX: 'Ninth',
    X: 'Tenth'
  }

  const handleConfirmStandard = () => {
    const semiSuffix = isSemi ? ' Semi' : ''
    const standardText = `${selectedStandard}${semiSuffix}`
    setFormData((prevData) => ({
      ...prevData,
      currentStandard: standardText
    }))
    setIsStandardDialogOpen(false)
  }

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason)
  }

  const handleConfirmReason = () => {
    if (selectedReason === 'Seat up for SSC exam at month of march') {
      const passStatus = formData.sscPassStatus === 'pass' ? 'passed' : 'failed'
      setFormData((prevData) => ({
        ...prevData,
        reasonOfLeaving: `Sent up for SSC exam of March ${formData.sscExamYear} and ${passStatus} in it`
      }))
    } else if (selectedReason === 'Other') {
      setFormData((prevData) => ({
        ...prevData,
        reasonOfLeaving: formData.otherReason
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        reasonOfLeaving: selectedReason
      }))
    }
    setIsReasonDialogOpen(false)
    setSelectedReason('')
  }

  const handleRemarksSelect = (remarks) => {
    setSelectedRemarks(remarks)
  }

  const handleConfirmRemarks = () => {
    if (selectedRemarks === 'Custom') {
      setFormData((prevData) => ({
        ...prevData,
        remarks: formData.customRemarks
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        remarks: selectedRemarks
      }))
    }
    setIsRemarksDialogOpen(false)
    setSelectedRemarks('')
  }

  const handleProgressSelect = (progress) => {
    setSelectedProgress(progress)
  }

  const handleConfirmProgress = () => {
    if (selectedProgress === 'Custom') {
      setFormData((prevData) => ({
        ...prevData,
        progress: formData.customProgress
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        progress: selectedProgress
      }))
    }
    setIsProgressDialogOpen(false)
    setSelectedProgress('')
  }

  const handleConductSelect = (conduct) => {
    setSelectedConduct(conduct)
  }

  const handleConfirmConduct = () => {
    if (selectedConduct === 'Custom') {
      setFormData((prevData) => ({
        ...prevData,
        conduct: formData.customConduct
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        conduct: selectedConduct
      }))
    }
    setIsConductDialogOpen(false)
    setSelectedConduct('')
  }

  const handleConfirmSince = () => {
    if (selectedSinceMonth && selectedSinceYear) {
      setFormData((prevData) => ({
        ...prevData,
        since: `${selectedSinceMonth} ${selectedSinceYear}`
      }))
    }
    setIsSinceDialogOpen(false)
  }

  const renderField = (field) => {
    switch (field.name) {
      case 'currentStandard':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly
            />
            <Dialog open={isStandardDialogOpen} onOpenChange={setIsStandardDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Current Standard</DialogTitle>
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
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="semi"
                    checked={isSemi}
                    onCheckedChange={(checked) => setIsSemi(checked)}
                  />
                  <Label htmlFor="semi">Semi</Label>
                </div>
                <Button onClick={handleConfirmStandard} className="w-full mt-4">
                  Confirm Standard
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 'reasonOfLeaving':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly
            />
            <Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Reason of Leaving</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {predefinedReasons.map((reason, index) => (
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
                {selectedReason === 'Seat up for SSC exam at month of march' && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="sscExamYear">SSC Exam Year</Label>
                    <Input
                      id="sscExamYear"
                      name="sscExamYear"
                      value={formData.sscExamYear}
                      onChange={handleInputChange}
                      placeholder="Enter SSC exam year"
                    />
                    <Label htmlFor="sscPassStatus">SSC Pass Status</Label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() =>
                          setFormData((prevData) => ({ ...prevData, sscPassStatus: 'pass' }))
                        }
                        variant={formData.sscPassStatus === 'pass' ? 'default' : 'outline'}
                        className="w-full"
                      >
                        Pass
                      </Button>
                      <Button
                        onClick={() =>
                          setFormData((prevData) => ({ ...prevData, sscPassStatus: 'fail' }))
                        }
                        variant={formData.sscPassStatus === 'fail' ? 'default' : 'outline'}
                        className="w-full"
                      >
                        Fail
                      </Button>
                    </div>
                  </div>
                )}
                {selectedReason === 'Other' && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="otherReason">Other Reason</Label>
                    <Input
                      id="otherReason"
                      name="otherReason"
                      value={formData.otherReason}
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
      case 'remarks':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly
            />
            <Dialog open={isRemarksDialogOpen} onOpenChange={setIsRemarksDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Remarks</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {remarksOptions.map((remark, index) => (
                    <Button
                      key={index}
                      onClick={() => handleRemarksSelect(remark)}
                      variant="outline"
                      className={`w-full justify-start ${selectedRemarks === remark ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      {remark}
                    </Button>
                  ))}
                </div>
                {selectedRemarks === 'Custom' && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="customRemarks">Custom Remarks</Label>
                    <Input
                      id="customRemarks"
                      name="customRemarks"
                      value={formData.customRemarks}
                      onChange={handleInputChange}
                      placeholder="Enter custom remarks"
                    />
                  </div>
                )}
                <Button onClick={handleConfirmRemarks} className="w-full mt-4">
                  Confirm Remarks
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 'progress':
      case 'conduct':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="w-full"
              readOnly
            />
            <Dialog
              open={field.name === 'progress' ? isProgressDialogOpen : isConductDialogOpen}
              onOpenChange={
                field.name === 'progress' ? setIsProgressDialogOpen : setIsConductDialogOpen
              }
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select {field.label}</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {(field.name === 'progress' ? progressOptions : conductOptions).map(
                    (option, index) => (
                      <Button
                        key={index}
                        onClick={() =>
                          field.name === 'progress'
                            ? handleProgressSelect(option)
                            : handleConductSelect(option)
                        }
                        variant="outline"
                        className={`w-full justify-start ${
                          (field.name === 'progress' ? selectedProgress : selectedConduct) ===
                          option
                            ? 'bg-primary text-primary-foreground'
                            : ''
                        }`}
                      >
                        {option}
                      </Button>
                    )
                  )}
                </div>
                {(field.name === 'progress' ? selectedProgress : selectedConduct) === 'Custom' && (
                  <div className="space-y-2 mt-4">
                    <Label
                      htmlFor={`custom${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`}
                    >
                      Custom {field.label}
                    </Label>
                    <Input
                      id={`custom${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`}
                      name={`custom${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`}
                      value={
                        formData[
                          `custom${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`
                        ]
                      }
                      onChange={handleInputChange}
                      placeholder={`Enter custom ${field.label.toLowerCase()}`}
                    />
                  </div>
                )}
                <Button
                  onClick={field.name === 'progress' ? handleConfirmProgress : handleConfirmConduct}
                  className="w-full mt-4"
                >
                  Confirm {field.label}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      case 'dateOfLeaving':
      case 'leaveCertificateGenerationDate':
        return (
          <Datepicker
            asSingle={true}
            useRange={false}
            value={{ startDate: formData[field.name], endDate: formData[field.name] }}
            onChange={(value) => handleDateChange(field.name, value)}
            displayFormat="DD-MM-YYYY"
            inputFormat="DD-MM-YYYY"
            placeholder={`Select ${field.label.toLowerCase()}`}
            inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )
      case 'since':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              placeholder="Select since month and year"
              className="w-full"
              readOnly
            />
            <Dialog open={isSinceDialogOpen} onOpenChange={setIsSinceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Select Since Month and Year</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Month</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month) => (
                        <Button
                          key={month}
                          onClick={() => setSelectedSinceMonth(month)}
                          variant={selectedSinceMonth === month ? 'default' : 'outline'}
                          size="sm"
                        >
                          {month}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Year</Label>
                    <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto">
                      {years.map((year) => (
                        <Button
                          key={year}
                          onClick={() => setSelectedSinceYear(year.toString())}
                          variant={selectedSinceYear === year.toString() ? 'default' : 'outline'}
                          size="sm"
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={handleConfirmSince} className="w-full mt-4">
                  Confirm
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        )
      default:
        return (
          <Input
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            type="text"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        )
    }
  }

  const formFields = [
    { name: 'progress', label: 'Progress', type: 'text' },
    { name: 'conduct', label: 'Conduct', type: 'text' },
    { name: 'dateOfLeaving', label: 'Date of Leaving School', type: 'date' },
    { name: 'currentStandard', label: 'Current Standard', type: 'select' },
    { name: 'since', label: 'Since', type: 'select' },
    { name: 'reasonOfLeaving', label: 'Reason of Leaving', type: 'text' },
    { name: 'remarks', label: 'Remarks', type: 'text' },
    {
      name: 'leaveCertificateGenerationDate',
      label: 'Leave Certificate Generation Date',
      type: 'date'
    }
  ]

  const closeCertificate = () => {
    navigate('/table')
  }

  const handleSave = async () => {
    try {
      const hasDataChanged = Object.keys(formData).some((key) => formData[key] !== studentData[key])

      if (hasDataChanged) {
        const updatedData = {
          ...formData,
          lastUpdated: format(new Date(), 'dd-MM-yyyy')
        }
        await window.api.updateStudent(studentData.GRN, updatedData)
        toast.success('Student data saved successfully')
        setStudentData((prevData) => ({ ...prevData, ...updatedData }))
      } else {
        toast.success('No changes to save')
      }

      navigate('/table')
    } catch (error) {
      console.error('Error saving student data:', error)
      toast.error('Failed to save student data')
    }
  }

  return (
    <>
      <div className="flex justify-between m-4">
        <h2 className="text-xl font-semibold mb-4">Leave Certificate Form</h2>
        <Button onClick={() => generateOfficialCertificate(false)}>
          Generate Official Certificate
        </Button>
        <Button onClick={generateDuplicateCertificate} variant="secondary">
          Generate Duplicate
        </Button>
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
            <div className="space-y-4 flex-grow overflow-y-auto px-4 pb-10">
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
    </>
  )
}

export default LeaveForm
