import puppeteer from 'puppeteer'
import { format } from 'date-fns'

// Convert numbers to words (for dates)
const numberToWords = (num) => {
  // ... (rest of the numberToWords function remains the same)
}

const dateToWords = (dateString) => {
  // ... (rest of the dateToWords function remains the same)
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
    return `<strong style="font-size: 18px;">${label}</strong> <span style="display: inline-block; position: relative; width: ${size}ch; font-weight: 500;">${field}${padding}<span style="position: absolute; bottom: 5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 10mm 10mm; color: #000; font-size: 14pt; }
          .container {  padding: 0mm; position: relative; }
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
            <h3>Jaggannath Shikshan Prasarak Mandal's</h3>
            <h2>Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal, Dist. Jalgaon</h2>
          </div>
          <div class="content">
            <h1 style="font-size: 24pt; margin: 0px 0;">Bonafide Certificate</h1>
            <div style="display: flex; justify-content: space-between;">
              ${createField('General Register No.', data.grn, 20)}
              ${createField('Date', formatDate(data.dateOfBonafide), 20)}
            </div>
            <p>This is to certify that Ms. ${createField('', data.name, 20)}${createField('', data.surname, 20)} is a student of Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal, Taluka-Yawal, Dist.-Jalgaon. She is currently enrolled in the ${createField('', data.currentStandardForBonafide, 10)} grade for the academic year ${createField('', data.academicYear, 15)}.</p>
            <p>This certificate is issued to her for the purposes of ${createField('', data.reasonOfBonafide, 20)} requirements. According to her leaving certificate, her date of birth is ${createField('', formatDate(data.dateOfBirth), 12)}, her birthplace is ${createField('', data.placeOfBirth, 20)}, and her caste, as per the general register, is ${createField('', data.caste, 15)}.</p>
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
