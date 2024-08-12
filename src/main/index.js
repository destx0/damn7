import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  generateLeaveCertificate,
  generateBonafideCertificate,
  getNextLeaveCertificateNumber,
  getNextBonafideCertificateNumber
} from './certificateGenerator'

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

  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('generate-leave-certificate', (event, data) => {
    try {
      const pdfBuffer = generateLeaveCertificate(data, 'DRAFT')
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error in generate-leave-certificate:', error)
      throw error
    }
  })

  ipcMain.handle('print-leave-certificate', (event, data) => {
    const certificateNumber = getNextLeaveCertificateNumber()
    const pdfBuffer = generateLeaveCertificate(data, certificateNumber)
    return {
      certificateNumber,
      pdfBase64: Buffer.from(pdfBuffer).toString('base64')
    }
  })

  ipcMain.handle('generate-bonafide-certificate', (event, data) => {
    try {
      const pdfBuffer = generateBonafideCertificate(data, 'DRAFT')
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error in generate-bonafide-certificate:', error)
      throw error
    }
  })

  ipcMain.handle('print-bonafide-certificate', (event, data) => {
    const certificateNumber = getNextBonafideCertificateNumber()
    const pdfBuffer = generateBonafideCertificate(data, certificateNumber)
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
