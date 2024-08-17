import puppeteer from 'puppeteer'

let bonafideCertificateNumber = 2000

export const getNextBonafideCertificateNumber = () => {
  return bonafideCertificateNumber++
}

export const generateBonafideCertificate = async (data, isDraft = true) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const certificateNumber = isDraft ? 'DRAFT' : getNextBonafideCertificateNumber()

  const content = `
    <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; color: #000; }
          .container { border: 3px double #000; padding: 20px; }
          h1 { color: #8b0000; text-align: center; font-size: 28px; }
          .info { margin-bottom: 20px; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bonafide Certificate</h1>
          <div class="info">
            <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Grade:</strong> ${data.grade}</p>
            <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>This is to certify that ${data.name} is a bonafide student of our institution, currently enrolled in Grade ${data.grade} for the academic year ${data.academicYear}.</p>
          <p>Student ID: ${data.studentId}</p>
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
