import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const BonafideForm = ({ studentData, pdfDataUrl, closeCertificate }) => {
  const [academicYear, setAcademicYear] = useState('')
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)

  const generateOfficialCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        academicYear
      }
      const base64Data = await window.api.generateOfficialBonafideCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 p-4 flex flex-col">
        <h2 className="text-xl mb-4">Bonafide Certificate Form</h2>
        <div className="space-y-4 flex-grow">
          <div>
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="Enter academic year"
            />
          </div>
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

export default BonafideForm
