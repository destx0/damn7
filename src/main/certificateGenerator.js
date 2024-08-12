import { jsPDF } from 'jspdf'

let leaveCertificateNumber = 1000 // Starting leave certificate number
let bonafideCertificateNumber = 2000 // Starting bonafide certificate number

export function generateLeaveCertificate(data, certNumber) {
  const doc = new jsPDF()
  doc.setFontSize(20)
  doc.text('Leave Certificate', 105, 20, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Certificate No: ${certNumber || 'DRAFT'}`, 105, 30, { align: 'center' })
  doc.text(`This is to certify that`, 105, 40, { align: 'center' })
  doc.setFontSize(18)
  doc.text(`${data.name}`, 105, 55, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Age: ${data.age}`, 105, 70, { align: 'center' })
  doc.text(`City: ${data.city}`, 105, 85, { align: 'center' })
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 100, { align: 'center' })

  return doc.output('arraybuffer')
}

export function generateBonafideCertificate(data, certNumber) {
  const doc = new jsPDF()
  doc.setFontSize(20)
  doc.text('Bonafide Certificate', 105, 20, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Certificate No: ${certNumber || 'DRAFT'}`, 105, 30, { align: 'center' })
  doc.text(`This is to certify that`, 105, 40, { align: 'center' })
  doc.setFontSize(18)
  doc.text(`${data.name}`, 105, 55, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Age: ${data.age}`, 105, 70, { align: 'center' })
  doc.text(`City: ${data.city}`, 105, 85, { align: 'center' })
  doc.text(`Is a bonafide employee of our organization`, 105, 100, { align: 'center' })
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 115, { align: 'center' })

  return doc.output('arraybuffer')
}

export function getNextLeaveCertificateNumber() {
  return ++leaveCertificateNumber
}

export function getNextBonafideCertificateNumber() {
  return ++bonafideCertificateNumber
}
