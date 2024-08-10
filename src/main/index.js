import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { jsPDF } from 'jspdf'

let certificateNumber = 1000 // Starting certificate number

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (is.dev) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function generatePDF(data, certNumber) {
  const doc = new jsPDF()
  doc.setFontSize(20)
  doc.text('Certificate', 105, 20, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Certificate No: ${certNumber}`, 105, 30, { align: 'center' })
  doc.text(`This is to certify that`, 105, 40, { align: 'center' })
  doc.setFontSize(18)
  doc.text(`${data.name}`, 105, 55, { align: 'center' })
  doc.setFontSize(14)
  doc.text(`Age: ${data.age}`, 105, 70, { align: 'center' })
  doc.text(`City: ${data.city}`, 105, 85, { align: 'center' })
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 100, { align: 'center' })

  return doc.output('arraybuffer')
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('generate-certificate', (event, data) => {
    try {
      const pdfBuffer = generatePDF(data, certificateNumber)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error in generate-certificate:', error)
      throw error
    }
  })

  ipcMain.handle('print-certificate', (event, data) => {
    certificateNumber++
    const pdfBuffer = generatePDF(data, certificateNumber)
    return {
      certificateNumber,
      pdfBase64: Buffer.from(pdfBuffer).toString('base64')
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
