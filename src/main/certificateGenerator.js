// src/main/certificateGenerator.js
import { jsPDF } from 'jspdf'

let leaveCertificateNumber = 1000
let bonafideCertificateNumber = 2000

export const getNextLeaveCertificateNumber = () => {
  return leaveCertificateNumber++
}

export const getNextBonafideCertificateNumber = () => {
  return bonafideCertificateNumber++
}

export const generateCertificate = (data, type, isDraft = true) => {
  const doc = new jsPDF()

  doc.setFontSize(22)
  doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Certificate`, 105, 20, {
    align: 'center'
  })

  doc.setFontSize(12)
  doc.text(
    `Certificate Number: ${isDraft ? 'DRAFT' : type === 'leave' ? getNextLeaveCertificateNumber() : getNextBonafideCertificateNumber()}`,
    20,
    40
  )
  doc.text(`Name: ${data.name}`, 20, 50)
  doc.text(`Grade: ${data.grade}`, 20, 60)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70)

  if (type === 'leave') {
    doc.text('This is to certify that the above-mentioned student has been granted leave.', 20, 90)
  } else {
    doc.text(`Age: ${data.age}`, 20, 80)
    doc.text(
      'This is to certify that the above-mentioned student is a bonafide student of our institution.',
      20,
      100
    )
  }

  if (isDraft) {
    doc.setFontSize(40)
    doc.setTextColor(200, 200, 200)
    doc.text('DRAFT', 105, 150, { align: 'center', angle: 45 })
  }

  return doc.output('arraybuffer')
}
