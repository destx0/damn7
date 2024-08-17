import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const PDFViewer = ({ pdfDataUrl, certificateType, isFullView, toggleFullView, studentData }) => {
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)

  useEffect(() => {
    setCurrentPdfUrl(pdfDataUrl)
  }, [pdfDataUrl])

  const generateOfficialCertificate = async () => {
    try {
      let base64Data
      if (certificateType === 'leave') {
        base64Data = await window.api.generateOfficialLeaveCertificate(studentData)
      } else if (certificateType === 'bonafide') {
        base64Data = await window.api.generateOfficialBonafideCertificate(studentData)
      } else {
        console.error('Unknown certificate type')
        return
      }

      const newPdfUrl = `data:application/pdf;base64,${base64Data}`
      setCurrentPdfUrl(newPdfUrl)
    } catch (error) {
      console.error('Error generating official certificate:', error)
    }
  }

  return (
    <div className={`p-4 overflow-auto ${isFullView ? 'w-full' : 'w-1/2'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">
          {certificateType.charAt(0).toUpperCase() + certificateType.slice(1)} Certificate Preview
        </h2>
        <div>
          <Button onClick={generateOfficialCertificate} className="mr-2">
            Generate Official Certificate
          </Button>
          <Button onClick={toggleFullView}>
            {isFullView ? 'Exit Full View' : 'Full Window View'}
          </Button>
        </div>
      </div>
      <iframe src={currentPdfUrl} className="w-full h-[calc(100%-60px)] border-none" />
    </div>
  )
}

export default PDFViewer
