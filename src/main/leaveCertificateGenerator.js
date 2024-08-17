import puppeteer from 'puppeteer'

let leaveCertificateNumber = 1000

export const getNextLeaveCertificateNumber = () => {
  return leaveCertificateNumber++
}

export const generateLeaveCertificate = async (data, isDraft = true) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const certificateNumber = isDraft ? 'DRAFT' : getNextLeaveCertificateNumber()

  const content = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .container { border: 2px solid #007bff; padding: 20px; }
          h1 { color: #007bff; text-align: center; }
          .info { margin-bottom: 20px; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Leave Certificate</h1>
          <div class="info">
            <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
            <p><strong>Student ID:</strong> ${data.studentId}</p>
            <p><strong>Name:</strong> ${data.name} ${data.surname}</p>
            <p><strong>Father's Name:</strong> ${data.fathersName}</p>
            <p><strong>Mother's Name:</strong> ${data.mothersName}</p>
            <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
            <p><strong>Admission Standard:</strong> ${data.admissionStandard}</p>
            <p><strong>Date of Admission:</strong> ${data.dateOfAdmission}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>This is to certify that the above-mentioned student has been granted leave from ${data.leaveStart} to ${data.leaveEnd}.</p>
          <p>Reason for leave: ${data.leaveReason}</p>
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
