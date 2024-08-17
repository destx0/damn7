import puppeteer from 'puppeteer'

let leaveCertificateNumber = 1000
let bonafideCertificateNumber = 2000

export const getNextLeaveCertificateNumber = () => {
  return leaveCertificateNumber++
}

export const getNextBonafideCertificateNumber = () => {
  return bonafideCertificateNumber++
}

export const generateCertificate = async (data, type, isDraft = true) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const certificateNumber = isDraft
    ? 'DRAFT'
    : type === 'leave'
      ? getNextLeaveCertificateNumber()
      : getNextBonafideCertificateNumber()

  const content = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-align: center; }
          .draft { position: absolute; font-size: 100px; color: #e0e0e0; transform: rotate(45deg); top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); }
        </style>
      </head>
      <body>
        <h1>${type.charAt(0).toUpperCase() + type.slice(1)} Certificate</h1>
        <p>Certificate Number: ${certificateNumber}</p>
        <p>Name: ${data.name}</p>
        <p>Grade: ${data.grade}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        ${
          type === 'leave'
            ? '<p>This is to certify that the above-mentioned student has been granted leave.</p>'
            : `<p>Age: ${data.age}</p>
             <p>This is to certify that the above-mentioned student is a bonafide student of our institution.</p>`
        }
        ${isDraft ? '<div class="draft">DRAFT</div>' : ''}
      </body>
    </html>
  `

  await page.setContent(content)
  const pdf = await page.pdf({ format: 'A4' })

  await browser.close()

  return pdf.buffer
}
