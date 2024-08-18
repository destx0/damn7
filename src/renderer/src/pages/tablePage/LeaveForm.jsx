import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const LeaveForm = ({ studentData, pdfDataUrl, closeCertificate }) => {
  const [formData, setFormData] = useState({
    leaveReason: '',
    leaveStart: '',
    leaveEnd: '',
    nationality: '',
    motherTongue: '',
    grn: '',
    ten: '',
    currentStandard: '',
    progress: '',
    conduct: '',
    dateOfLeaving: '',
    reasonOfLeaving: '',
    remarks: ''
  })
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)

  useEffect(() => {
    loadLatestCertificate()
  }, [])

  const loadLatestCertificate = async () => {
    try {
      const latestCertificate = await window.api.getLatestCertificate(studentData.id, 'leave')
      if (latestCertificate) {
        setFormData((prevData) => ({
          ...prevData,
          ...latestCertificate.data
        }))
        setCurrentPdfUrl(latestCertificate.data.pdfUrl || pdfDataUrl)
      }
    } catch (error) {
      console.error('Error loading latest leave certificate:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
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

      // Save the certificate data
      await window.api.saveCertificate(studentData.id, 'leave', {
        ...certificateData,
        pdfUrl: newPdfUrl
      })
    } catch (error) {
      console.error('Error generating official leave certificate:', error)
    }
  }

  const formFields = [
    { name: 'leaveReason', label: 'Reason for Leave', type: 'textarea' },
    { name: 'leaveStart', label: 'Leave Start Date', type: 'date' },
    { name: 'leaveEnd', label: 'Leave End Date', type: 'date' },
    { name: 'nationality', label: 'Nationality', type: 'text' },
    { name: 'motherTongue', label: 'Mother Tongue', type: 'text' },
    { name: 'grn', label: 'GRN', type: 'text' },
    { name: 'ten', label: 'TEN', type: 'text' },
    { name: 'currentStandard', label: 'Current Standard', type: 'text' },
    { name: 'progress', label: 'Progress', type: 'text' },
    { name: 'conduct', label: 'Conduct', type: 'text' },
    { name: 'dateOfLeaving', label: 'Date of Leaving', type: 'date' },
    { name: 'reasonOfLeaving', label: 'Reason of Leaving', type: 'textarea' },
    { name: 'remarks', label: 'Remarks', type: 'textarea' }
  ]

  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 p-4 flex flex-col overflow-y-auto">
        <h2 className="text-xl mb-4">Leave Certificate Form</h2>
        <div className="space-y-4 flex-grow">
          {formFields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={generateOfficialCertificate}>Generate Official Certificate</Button>
          <Button onClick={closeCertificate}>Close</Button>
        </div>
      </div>
      <div className="w-1/2 p-4">
        <iframe src={currentPdfUrl} className="w-full h-full border-none" />
      </div>
    </div>
  )
}

export default LeaveForm
