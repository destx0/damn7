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
          h1 { color: #8b0000; text-align: center; font-size: 28px; margin-bottom: 20px; }
          .info { margin-bottom: 20px; }
          .info p { margin: 5px 0; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
          .signature { margin-top: 50px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Bonafide Certificate</h1>
          <div class="info">
            <p><strong>Certificate Number:</strong> ${certificateNumber}</p>
            <p><strong>Student ID:</strong> ${data.studentId}</p>
            <p><strong>Name:</strong> ${data.name} ${data.surname}</p>
            <p><strong>Father's Name:</strong> ${data.fathersName}</p>
            <p><strong>Mother's Name:</strong> ${data.mothersName}</p>
            <p><strong>Date of Birth:</strong> ${data.dateOfBirth}</p>
            <p><strong>Admission Standard:</strong> ${data.admissionStandard}</p>
            <p><strong>Date of Admission:</strong> ${data.dateOfAdmission}</p>
            <p><strong>Current Standard:</strong> ${data.currentStandard}</p>
            <p><strong>Academic Year:</strong> ${data.academicYear}</p>
          </div>
          <p>This is to certify that <strong>${data.name} ${data.surname}</strong> (Student ID: ${data.studentId}) is a bonafide student of our institution. ${data.gender === 'Male' ? 'He' : 'She'} is currently enrolled in <strong>${data.currentStandard}</strong> for the academic year ${data.academicYear}.</p>
          <p>${data.gender === 'Male' ? 'He' : 'She'} was admitted to our institution on ${data.dateOfAdmission} in ${data.admissionStandard}.</p>
          <p>To the best of our knowledge, the date of birth of the student as per our records is ${data.dateOfBirth}.</p>
          <p>This certificate is issued upon the request of the student for the purpose of ${data.purpose || '_________________'}.</p>
          <div class="signature">
            <p>Principal's Signature</p>
            <br>
            <p>____________________</p>
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
