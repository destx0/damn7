import puppeteer from 'puppeteer'
import { format } from 'date-fns'

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

export const generateLeaveCertificate = async (data, isDraft = true) => {
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
    return `<strong style="font-size: 18px;">${label}:</strong> <span style="display: inline-block; position: relative; width: ${size}ch; font-weight: 500;">${field}${padding}<span style="position: absolute; bottom: 5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const dateOfBirthInWords = dateToWords(data.dateOfBirth)

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 10mm 10mm; color: #000; font-size: 13pt; }
          .container { border: 2px solid #000; padding: 2mm; position: relative; width: 195mm; height: 297mm; box-sizing: border-box; }
          h1, h2, h3 { text-align: center; margin: 0; }
          .header { margin-bottom: 10px; }
          .content { line-height: 1.6; }
          .footer { margin-top: 20px; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
          pre { font-family: inherit; white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h3>Jaggannath Shikshan Prasarak Mandal's</h3>
            <h2>Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h2>
            <h3>Taluka- Yawal, Dist. Jalgaon</h3>
            <p style="text-align: center;">Phone No. 02585-261290 &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; E Mail - mksyawal@yahoo.in</p>
          </div>
          <div class="content">
            <div style="display: flex; justify-content: space-between;">
              <span>${createField('Sr. No.', certificateNumber, 8)}</span>
              <span>${createField('G. Register No.', data.grn, 6)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>School Reg. No.</strong>- Edu. Depu.Dir/Sec-2/First Appru/</span>
              <span>${createField('PEN', data.PENNo, 15)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="padding-left: 7.5em;">90-91/92/Div.Sec.Depu.Dir.Nashik/Datted 12-3-92</span>
              <span><strong>Medium:</strong> Marathi</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>U Dise No.</strong>- 27031508414</span>
              <span><strong>Board</strong>- Nashik</span>
              <span><strong>Index No.</strong>- 15.15.005</span>
            </div>
            <h1 style="font-size: 24pt; margin: 10px 0;">Leave Certificate</h1>
            <pre>
${createField('Student ID', data.studentId, 25)} ${createField('U.I.D. No. (Aadhar Card No.)', data.aadharNo, 24)}
<strong>Name of the student in full</strong> ${createField('(Name)', data.name, 20)} ${createField("(Father's Name)", data.fathersName, 20)}
                                        ${createField('(Surname)', data.surname, 30)}
${createField("Mother's Name", data.mothersName, 40)}
${createField('Nationality', data.nationality || 'Indian', 20)} ${createField('Mother tongue', data.motherTongue, 40)}
${createField('Religion', data.religion, 15)} ${createField('Caste', data.caste, 20)} ${createField('Sub-caste', data.subCaste, 25)}
${createField('Place of Birth', data.placeOfBirth, 10)} ${createField('Taluka', data.taluka, 10)} ${createField('Dist', data.district, 10)} ${createField('State', data.state, 12)} <strong>Country:</strong> India
${createField('Date of Birth (DD/MM/YY) according to the Christian era', formatDate(data.dateOfBirth), 34)}
${createField('Date of Birth (In words)', dateOfBirthInWords, 64)}
<strong>Last school attended & standard:</strong>${createField('', data.lastAttendedSchool, 55)}
${createField('', data.lastSchoolStandard, 85)}
${createField('Date of admission in this school', formatDate(data.dateOfAdmission), 24)} ${createField('Standard', data.admissionStandard, 25)}
${createField('Progress', data.progress, 33)} ${createField('Conduct', data.conduct, 35)}
${createField('Date of leaving school', formatDate(data.dateOfLeaving), 65)}
${createField('Standard in which studying and since when (in words and figure)', data.currentStandard, 85)}
${createField('Reason of leaving school', data.reasonOfLeaving, 64)}
${createField('Remarks', data.remarks, 78)}
            </pre>
            <p>This is to certify that the above-mentioned student has been granted leave from ${formatDate(data.leaveStart)} to ${formatDate(data.leaveEnd)}.</p>
            <p>Reason for leave: ${data.leaveReason}</p>
          </div>
          <div class="footer">
            <p style="font-weight: bold;">Certified that the above information is in accordance with the School Register.</p>
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
              <div><strong>Date:</strong> ${new Date().getDate()}</div>
              <div><strong>Month:</strong> ${new Date().toLocaleString('default', { month: 'long' })}</div>
              <div><strong>Year:</strong> ${new Date().getFullYear()}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
              <div><strong>Class Teacher</strong></div>
              <div><strong>Clerk</strong></div>
              <div><strong>Head Master</strong><br>(Seal)</div>
            </div>
            <pre style="font-size: 10pt; margin-top: 20px;">* No change in any entry in this certificate shall be made except by the authority issuing it.
* Any infringement of the rule is liable to be dealt with by rustication or by other suitable punishment.</pre>
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
