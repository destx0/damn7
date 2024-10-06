import puppeteer from 'puppeteer'
import { format } from 'date-fns'
import { getPuppeteerConfig, setupPuppeteer } from './puppeteerConfig'
import { dateToWords, monthYear } from './dateUtils'

const romanToOrdinal = {
  V: 'Fifth',
  VI: 'Sixth',
  VII: 'Seventh',
  VIII: 'Eighth',
  IX: 'Ninth',
  X: 'Tenth'
}

const formatStandard = (standard) => {
  if (!standard) return ''

  const [roman, semi] = standard.split(' ')
  const ordinal = romanToOrdinal[roman] || roman

  if (semi === 'Semi') {
    return `${ordinal} ${roman}<sup>th</sup> Semi`
  }

  return `${ordinal} ${roman}<sup>th</sup>`
}

export const generateLeaveCertificate = async (data, isDraft = true) => {
  const certificateNumber = isDraft ? 'DRAFT' : data.certificateNumber.toString().padStart(4, '0')

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const createField = (label, value, size) => {
    const field = value || '---'
    const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
    return `<strong style="font-size: 18px;">${label}:</strong> <span style="display: inline-block; position: relative; width: ${size}ch; font-weight: 500;">${field}${padding}<span style="position: absolute; bottom: 5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }
  const createFieldNoColon = (label, value, size) => {
    const field = value || '---'
    const padding = '&nbsp;'.repeat(Math.max(0, size - field.length))
    return `<strong style="font-size: 18px;">${label}</strong> <span style="display: inline-block; position: relative; width: ${size}ch; font-weight: 500;">${field}${padding}<span style="position: absolute; bottom: 5px; left: 0; right: 0; border-bottom: 1px solid black;"></span></span>`
  }

  const formatLastAttendedSchool = (schoolName) => {
    if (!schoolName) return createField('', '---', 42)

    const maxLength = 50 // Character limit for the first line
    if (schoolName.length <= maxLength) {
      return createField('', schoolName, 42)
    } else {
      // Find the last space before the character limit
      let splitIndex = schoolName.lastIndexOf(' ', maxLength)
      if (splitIndex === -1) {
        // If no space found, split at the character limit
        splitIndex = maxLength
      }
      const firstLine = schoolName.slice(0, splitIndex)
      const secondLine = schoolName.slice(splitIndex).trim()

      return createField('', firstLine, 53) + '\n' + createFieldNoColon('', secondLine, 71)
    }
  }

  const dateOfBirthInWords = dateToWords(data.dateOfBirth)
  const generationDate = data.leaveCertificateGenerationDate
    ? new Date(data.leaveCertificateGenerationDate)
    : new Date()

  const certificateTitle = data.isDuplicate
    ? '<i>Duplicate</i> Leaving Certificate'
    : 'Leaving Certificate'

  const getSinceField = () => {
    if (data.since) {
      return data.since
    } else if (data.dateOfAdmission) {
      return monthYear(data.dateOfAdmission)
    }
    return '' // Return empty string if neither is available
  }

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 10mm 10mm; color: #000; font-size: 13pt; }
          .container { border: 2px solid #000; padding: 2mm; position: relative; width: 195mm; height: 275mm; box-sizing: border-box; }
          h1, h2, h3 { text-align: center; margin: 0; }
          .header { margin-bottom: -10px; }
          .content { line-height: 1.6;margin-top: -5px; font-weight: 500;}
          .footer { margin-top: -40px; }
          .draft {
            position: absolute;
            font-size: 100px;
            color: rgba(224, 224, 224, 0.3);
            transform: rotate(45deg);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          pre { font-family: inherit; white-space: pre-wrap; word-wrap: break-word; }
          sup { font-size: 0.6em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h3>Jagannath Shikshan Prasarak Mandal's</h3>
            <h2>Shashikant Sakharam Chaudhari Kanya Vidyalay, Yawal</h2>
            <h3>Taluka- Yawal, Dist. Jalgaon</h3>
            <p style="text-align: center;margin-top: -0px;">Medium - Marathi &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; E Mail - mksyawal@yahoo.in</p>
          </div>
          <div class="content">
            <div style="display: flex; justify-content: space-between;">
              <span>${createField('Sr. No.', certificateNumber, 8)}</span>
              <span>${createField('G. Register No.', data.GRN, 7)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>School Reg. No.</strong>- Edu. Depu.Dir/Sec-2/First Appru/90-91/92/Div.Sec.Depu.Dir.Nashik/Datted 12-3-92</span>
            </div>
                       <div style="display: flex; justify-content: space-between;">
              <span><strong>U Dise No.</strong>- 27031508414</span>
              <span><strong>Board</strong>- Nashik</span>
              <span>${createField('Index No.', '15.15.005', 12)}</span>
            </div>
            <h1 style="font-size: 24pt; margin-top: -10px;margin-bottom: 0px;">${certificateTitle}</h1>
            <pre style="margin-top: 10px;">
${createField('PEN', data.PENNo, 32)} ${createField('APAAR ID/ABC ID', data.APAARId, 25)}
${createField('Student ID', data.studentId, 26)}  ${createField('U.I.D. No. (Aadhar Card No.)', data.aadharNo, 16)}
<strong>Name of the student in full</strong> ${createField('(Name)', data.name, 15)} ${createField("(Father's Name)", data.fathersName, 20)}
                                        ${createField('(Surname)', data.surname, 51)}
${createField("Mother's Name", data.mothersName, 67)}
${createField('Nationality', data.nationality || 'Indian', 20)} ${createField('Mother tongue', data.motherTongue, 36)}
${createField('Religion', data.religion, 15)} ${createField('Caste', data.caste, 22)} ${createField('Sub-caste', data.subCaste, 20)}
${createField('Place of Birth', data.placeOfBirth, 20)} ${createField('Taluka', data.taluka, 17)} ${createField('Dist', data.district, 18)}
${createField('State', data.state, 27)} ${createField('Country', 'India', 40)}
${createField('Date of Birth (DD/MM/YY) according to the Christian era', formatDate(data.dateOfBirth), 29)}
${createField('Date of Birth (In words)', dateOfBirthInWords, 60)}
<strong>Last school attended & standard</strong>${formatLastAttendedSchool(data.lastAttendedSchool)}${createField('', data.lastSchoolStandard ? data.lastSchoolStandard + '<sup>th</sup>' : '', 9)}
${createField('Date of admission in this school', formatDate(data.dateOfAdmission), 24)} ${createField('Standard', data.admissionStandard ? data.admissionStandard + '<sup>th</sup>' : '', 19)}
${createField('Progress', data.progress, 33)} ${createField('Conduct', data.conduct, 30)}
${createField('Date of leaving school', formatDate(data.dateOfLeaving), 60)}
${createField('Standard in which studying and since when (in words and figure)', formatStandard(data.currentStandard), 22)}
Since${createField('', getSinceField(), 76)}
${createField('Reason of leaving school', data.reasonOfLeaving, 58)}
${createField('Remarks', data.remarks, 72)}
            </pre>
          </div>
          <div class="footer">
            <p style="font-weight: bold;">Certified that the above information is in accordance with the School Register.</p>
            <div style="display: flex; justify-content: flex-start; margin-top: -5px;">
              <div style="margin-right: 40px;"><strong>Date:</strong> ${generationDate.getDate()}</div>
              <div style="margin-right: 40px;"><strong>Month:</strong> ${generationDate.toLocaleString('default', { month: 'long' })}</div>
              <div><strong>Year:</strong> ${generationDate.getFullYear()}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 60px;">
              <div><strong>Class Teacher</strong></div>
              <div><strong>Clerk</strong></div>
              <div><strong>Head Master(Seal)</strong></div>
            </div>
            <pre style="font-size: 10pt; margin-top: 5px;">* No change in any entry in this certificate shall be made except by the authority issuing it.
* Any infringement of the rule is liable to be dealt with by rustication or by other suitable punishment.</pre>
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
