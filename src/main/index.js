import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { generateLeaveCertificate } from './leaveCertificateGenerator'
import { generateBonafideCertificate } from './bonafideCertificateGenerator'
import {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getNextCertificateNumber,
  incrementCertificateCounter,
  initializeDatabase
} from './dbOperations'

// Function to create the main window
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

// Function to set up IPC handlers
function setupIpcHandlers() {
  // Database operations
  ipcMain.handle('add-student', async (_, student) => {
    try {
      return await addStudent(student)
    } catch (error) {
      console.error('Error adding student:', error)
      throw error
    }
  })

  ipcMain.handle('get-students', async () => {
    try {
      return await getStudents()
    } catch (error) {
      console.error('Error getting students:', error)
      throw error
    }
  })

  ipcMain.handle('get-student', async (_, studentId) => {
    try {
      return await getStudent(studentId)
    } catch (error) {
      console.error('Error getting student:', error)
      throw error
    }
  })

  ipcMain.handle('update-student', async (_, studentId, student) => {
    try {
      return await updateStudent(studentId, student)
    } catch (error) {
      console.error('Error updating student:', error)
      throw error
    }
  })

  ipcMain.handle('delete-student', async (_, studentId) => {
    try {
      return await deleteStudent(studentId)
    } catch (error) {
      console.error('Error deleting student:', error)
      throw error
    }
  })

  // Certificate operations
  ipcMain.handle('generate-draft-leave-certificate', async (_, data) => {
    try {
      const nextNumber = await getNextCertificateNumber('leave')
      const pdfBuffer = await generateLeaveCertificate(
        { ...data, certificateNumber: nextNumber },
        true
      )
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating draft leave certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-official-leave-certificate', async (_, data) => {
    try {
      const nextNumber = await getNextCertificateNumber('leave')
      const pdfBuffer = await generateLeaveCertificate(
        { ...data, certificateNumber: nextNumber },
        false
      )
      const base64Pdf = Buffer.from(pdfBuffer).toString('base64')
      await incrementCertificateCounter('leave')
      return base64Pdf
    } catch (error) {
      console.error('Error generating official leave certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-draft-bonafide-certificate', async (_, data) => {
    try {
      const nextNumber = await getNextCertificateNumber('bonafide')
      const pdfBuffer = await generateBonafideCertificate(
        { ...data, certificateNumber: nextNumber },
        true
      )
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating draft bonafide certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-official-bonafide-certificate', async (_, data) => {
    try {
      const nextNumber = await getNextCertificateNumber('bonafide')
      const pdfBuffer = await generateBonafideCertificate(
        { ...data, certificateNumber: nextNumber },
        false
      )
      const base64Pdf = Buffer.from(pdfBuffer).toString('base64')
      await incrementCertificateCounter('bonafide')
      return base64Pdf
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
      throw error
    }
  })
}

// App lifecycle events
app.whenReady().then(async () => {
  try {
    await initializeDatabase()
    console.log('Database initialized successfully')
    setupIpcHandlers()
    createWindow()
  } catch (error) {
    console.error('Failed to initialize database:', error)
    app.quit()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Optionally, log this error to a file or remote logging service
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Optionally, log this error to a file or remote logging service
})
