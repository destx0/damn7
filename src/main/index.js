import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { generateLeaveCertificate } from './leaveCertificateGenerator'
import { generateBonafideCertificate } from './bonafideCertificateGenerator'
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  saveCertificate,
  getLatestCertificate
} from './dbOperations'

function createWindow() {
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupIpcHandlers() {
  // Database operations
  ipcMain.handle('add-student', async (_, student) => {
    return addStudent(student)
  })

  ipcMain.handle('get-students', async () => {
    return getStudents()
  })

  ipcMain.handle('update-student', async (_, id, student) => {
    return updateStudent(id, student)
  })

  ipcMain.handle('delete-student', async (_, id) => {
    return deleteStudent(id)
  })

  // Leave Certificate operations
  ipcMain.handle('generate-draft-leave-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateLeaveCertificate(data, true)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating draft leave certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-official-leave-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateLeaveCertificate(data, false)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating official leave certificate:', error)
      throw error
    }
  })

  // Bonafide Certificate operations
  ipcMain.handle('generate-draft-bonafide-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateBonafideCertificate(data, true)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating draft bonafide certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-official-bonafide-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateBonafideCertificate(data, false)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
      throw error
    }
  })

  // New IPC handlers for certificate operations
  ipcMain.handle('save-certificate', async (_, studentId, type, data) => {
    try {
      return await saveCertificate(studentId, type, data)
    } catch (error) {
      console.error('Error saving certificate:', error)
      throw error
    }
  })

  ipcMain.handle('get-latest-certificate', async (_, studentId, type) => {
    try {
      return await getLatestCertificate(studentId, type)
    } catch (error) {
      console.error('Error getting latest certificate:', error)
      throw error
    }
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  setupIpcHandlers()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // You might want to log this error to a file or send it to a remote logging service
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // You might want to log this error to a file or send it to a remote logging service
})
