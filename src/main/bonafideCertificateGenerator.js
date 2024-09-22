import puppeteer from 'puppeteer'
import { format } from 'date-fns'
import { getPuppeteerConfig, setupPuppeteer } from './puppeteerConfig'

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
  const certificateNumber = isDraft ? 'DRAFT' : data.certificateNumber.toString().padStart(4, '0')

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const createField = (label, value, size) => {
    const field = value || ''
    const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
    return `<strong style="font-size: 18px;">${label}</strong> <span style="display: inline-block; position: relative; width: ${size}ch; font-weight: 700;">${field}${padding}<span style="position: absolute; bottom: 5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 10mm 10mm; color: #000; font-size: 14pt; }
          .container { padding: 0mm; position: relative; }
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
            <h3>Jagannath Shikshan Prasarak Mandal's</h3>
            <h2>Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal, Dist. Jalgaon</h2>
          </div>
          <div class="content">
            <h1 style="font-size: 24pt; margin: 5px 0;">Bonafide Certificate</h1>
            <div style="display: flex; justify-content: space-between;">
              <div>${createField('General Register No.', data.GRN, 20)}</div>
              <div>${createField('Date', formatDate(data.dateOfBonafide), 20)}&nbsp;&nbsp;&nbsp;&nbsp;</div>
            </div>
            <p>This is to certify that Ms. ${createField('', data.name, 20)} ${createField('', data.surname, 20)}, daughter of ${createField('', data.fathersName, 30)}, is a student of Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal, Taluka-Yawal, Dist.-Jalgaon. She is currently enrolled in the ${createField('', data.currentStandardForBonafide, 10)} grade for the academic year ${createField('', data.academicYear, 22)}.</p>
            <p>This certificate is issued to her for the purposes of ${createField('', data.reasonOfBonafide, 20)} requirements. According to her leaving certificate, her date of birth is ${createField('', formatDate(data.dateOfBirth), 12)}, her birthplace is ${createField('', data.placeOfBirth, 24)}, and her caste, as per the general register, is ${createField('', data.caste, 15)}.</p>
            <p>This certificate is issued at the request of ${createField('', data.requestOfBonafideBy, 42)}.</p>
          </div>
          <div class="footer">
            <div style="display: flex; justify-content: space-around; margin-top: 80px;">
              <div><strong></strong></div>
              <div><strong>Head Master</strong></div>
            </div>
          </div>
          ${isDraft ? '<div class="draft">DRAFT</div>' : ''}
        </div>
      </body>
    </html>
  `

  try {
    const browser = await puppeteer.launch(getPuppeteerConfig())
    const page = await setupPuppeteer(browser)
    await page.setContent(content)
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    return pdfBuffer
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
