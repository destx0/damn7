import puppeteer from 'puppeteer'
import { format } from 'date-fns'

// Convert numbers to words (for dates)
const numberToWords = (num) => {
  const units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'
  ]

  if (num < 20) return units[num]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '')
  if (num < 1000)
    return (
      units[Math.floor(num / 100)] +
      ' Hundred' +
      (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '')
    )
  return (
    numberToWords(Math.floor(num / 1000)) +
    ' Thousand' +
    (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '')
  )
}

const dateToWords = (dateString) => {
  const date = new Date(dateString)
  const day = numberToWords(date.getDate())
  const month = date.toLocaleString('default', { month: 'long' })
  const year = numberToWords(date.getFullYear())
  return `${day} ${month} ${year}`
}

export const generateBonafideCertificate = async (data, isDraft = true) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const certificateNumber = isDraft ? 'DRAFT' : data.certificateNumber.toString().padStart(4, '0')

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const createField = (label, value, size) => {
    const field = value || ''
    const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
    return `<strong>${label}:</strong> <span style="display: inline-block; position: relative; width: ${size}ch;">${field}${padding}<span style="position: absolute; bottom: -5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 20mm 12mm; color: #000; font-size: 12pt; }
          .container { border: 2px solid #000; padding: 10mm; position: relative; width: 210mm; height: 297mm; box-sizing: border-box; }
          h1, h2, h3 { text-align: center; margin: 0; }
          .header { margin-bottom: 10px; }
          .content { line-height: 1.6; }
          .footer { margin-top: 20px; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Jaggannath Shikshan Prasarak Mandal's</h2>
            <h1>Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h1>
            <h3>Taluka- Yawal, Dist. Jalgaon</h3>
          </div>
          <div class="content">
            <h1 style="font-size: 24pt; margin: 20px 0;">Bonafide Certificate</h1>
            <div style="display: flex; justify-content: space-between;">
              ${createField('Certificate No.', certificateNumber, 10)}
              ${createField('General Register No.', data.grn, 20)}
              ${createField('Date', formatDate(data.dateOfBonafide), 20)}
            </div>
            <p>This is to certify that Ms. <strong>${data.name} ${data.fathersName} ${data.surname}</strong> is a student of Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal, Taluka-Yawal, Dist.-Jalgaon. She is currently enrolled in the <strong>${data.currentStandardForBonafide}</strong> grade for the academic year <strong>${data.academicYear}</strong>.</p>
            <p>This certificate is issued to her for the purposes of ${createField('', data.reasonOfBonafide, 30)} requirements.</p>
            <p>According to her leaving certificate, her date of birth is ${createField('', formatDate(data.dateOfBirth), 20)}, her birthplace is ${createField('', data.placeOfBirth, 20)}, and her caste, as per the general register, is ${createField('', data.caste, 20)}.</p>
            <p>This certificate is issued at the request of ${createField('', data.requestOfBonafideBy, 30)}.</p>
          </div>
          <div class="footer">
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
              <div><strong>Class Teacher</strong></div>
              <div><strong>Clerk</strong></div>
              <div><strong>Head Master</strong><br>(Seal)</div>
            </div>
          </div>
          ${isDraft ? '<div class="draft">DRAFT</div>' : ''}
        </div>
      </body>
    </html>
  `

  await page.setContent(content)
  const pdf = await page.pdf({ format: 'A4' })

  await browser.close()

  return pdf.buffer
}
