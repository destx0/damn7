import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
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

  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 p-4 flex flex-col">
        <h2 className="text-xl mb-4">Leave Certificate Form</h2>
        <div className="space-y-4 flex-grow overflow-auto">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </Label>
              <Input
                id={key}
                value={value}
                onChange={handleInputChange}
                type={key.includes('date') ? 'date' : 'text'}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              />
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
