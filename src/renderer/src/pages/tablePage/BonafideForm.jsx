import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const BonafideForm = ({ studentData, pdfDataUrl, closeCertificate, onStudentUpdate }) => {
  const [formData, setFormData] = useState({
    academicYear: '',
    reasonOfBonafide: '',
    requestOfBonafideBy: '',
    dateOfBonafide: '',
    currentStandardForBonafide: '',
    bonafideStandard: ''
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

  const generateOfficialCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        ...formData
      }
      const base64Data = await window.api.generateOfficialBonafideCertificate(certificateData)
      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)

      // Update student data in the students table
      await window.api.updateStudent(studentData.studentId, formData)
      onStudentUpdate({ ...studentData, ...formData })
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
    }
  }

  const formFields = [
    { name: 'academicYear', label: 'Academic Year', type: 'text' },
    { name: 'currentStandardForBonafide', label: 'Current Standard for Bonafide', type: 'text' },
    { name: 'bonafideStandard', label: 'Bonafide Standard', type: 'text' },
    { name: 'dateOfBonafide', label: 'Date of Bonafide', type: 'date' },
    { name: 'reasonOfBonafide', label: 'Reason of Bonafide', type: 'textarea' },
    { name: 'requestOfBonafideBy', label: 'Request of Bonafide By', type: 'text' }
  ]

  return (
    <div className="flex w-full h-full">
      <div className="w-1/2 p-4 flex flex-col overflow-y-auto">
        <h2 className="text-xl mb-4">Bonafide Certificate Form</h2>
        <div className="flex justify-between mb-4">
          <Button onClick={generateOfficialCertificate}>Generate Official Certificate</Button>
          <Button onClick={closeCertificate}>Close</Button>
        </div>
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
                  readOnly={field.readOnly}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  readOnly={field.readOnly}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-4">
        <iframe src={currentPdfUrl} className="w-full h-full border-none" />
      </div>
    </div>
  )
}

export default BonafideForm
