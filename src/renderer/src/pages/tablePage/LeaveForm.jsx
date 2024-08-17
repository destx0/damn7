import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LeaveForm = ({ studentData, pdfDataUrl, closeCertificate }) => {
  const [leaveReason, setLeaveReason] = useState('')
  const [leaveStart, setLeaveStart] = useState('')
  const [leaveEnd, setLeaveEnd] = useState('')
  const [currentPdfUrl, setCurrentPdfUrl] = useState(pdfDataUrl)

  useEffect(() => {
    loadLatestCertificate()
  }, [])

  const loadLatestCertificate = async () => {
    try {
      const latestCertificate = await window.api.getLatestCertificate(studentData.id, 'leave')
      if (latestCertificate) {
        setLeaveReason(latestCertificate.data.leaveReason || '')
        setLeaveStart(latestCertificate.data.leaveStart || '')
        setLeaveEnd(latestCertificate.data.leaveEnd || '')
        setCurrentPdfUrl(latestCertificate.data.pdfUrl || pdfDataUrl)
      }
    } catch (error) {
      console.error('Error loading latest leave certificate:', error)
    }
  }

  const generateOfficialCertificate = async () => {
    try {
      const certificateData = {
        ...studentData,
        leaveReason,
        leaveStart,
        leaveEnd
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
        <div className="space-y-4 flex-grow">
          <div>
            <Label htmlFor="leaveReason">Reason for Leave</Label>
            <Input
              id="leaveReason"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="Enter reason for leave"
            />
          </div>
          <div>
            <Label htmlFor="leaveStart">Leave Start Date</Label>
            <Input
              id="leaveStart"
              type="date"
              value={leaveStart}
              onChange={(e) => setLeaveStart(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="leaveEnd">Leave End Date</Label>
            <Input
              id="leaveEnd"
              type="date"
              value={leaveEnd}
              onChange={(e) => setLeaveEnd(e.target.value)}
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

export default LeaveForm
