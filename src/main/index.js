import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { generateLeaveCertificate } from './leaveCertificateGenerator'
import { generateBonafideCertificate } from './bonafideCertificateGenerator'
import {
  initializeDatabase,
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getNextCertificateNumber,
  incrementCertificateCounter,
  saveCertificate,
  getLatestCertificate,
  getStudentById,
  incrementBonafideGeneratedCount,
  getBonafideGeneratedCount,
  incrementLeaveGeneratedCount,
  getLeaveGeneratedCount,
  getStudentByGRN
} from './dbOperations'
import { handleImportData, resolveDuplicates } from './ImportHandler'

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
  ipcMain.handle('add-student', async (event, studentData) => {
    try {
      const newStudent = {
        ...studentData,
        lastUpdated: new Date().toISOString()
      }
      const addedStudent = await addStudent(newStudent)
      return addedStudent
    } catch (error) {
      console.error('Error adding student:', error)
      throw error
    }
  })

  ipcMain.handle('get-students', async () => {
    try {
      const students = await getStudents();
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  })

  ipcMain.handle('get-student', async (_, GRN) => {
    console.log('Fetching student with GRN:', GRN)
    const student = await getStudent(GRN)
    console.log('Fetched student:', student)
    return student
  })

  ipcMain.handle('update-student', async (event, GRN, updatedData) => {
    try {
      const existingStudent = await getStudentByGRN(GRN)
      const updatedStudent = {
        ...existingStudent,
        ...updatedData,
        lastUpdated: new Date().toISOString()
      }
      const result = await updateStudent(GRN, updatedStudent)
      return result
    } catch (error) {
      console.error('Error updating student:', error)
      throw error
    }
  })

  ipcMain.handle('delete-student', async (_, GRN) => {
    console.log('Received delete request for student GRN:', GRN)
    const result = await deleteStudent(GRN)
    console.log('Delete operation result:', result)
    return result
  })

  ipcMain.handle(
    'get-next-certificate-number',
    async (_, type) => await getNextCertificateNumber(type)
  )
  ipcMain.handle(
    'increment-certificate-counter',
    async (_, type) => await incrementCertificateCounter(type)
  )

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
      await incrementLeaveGeneratedCount(data.GRN) // Changed from studentId to GRN
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
      await incrementBonafideGeneratedCount(data.GRN) // Changed from studentId to GRN
      return base64Pdf
    } catch (error) {
      console.error('Error generating official bonafide certificate:', error)
      throw error
    }
  })

  // Add these new handlers for bonafide generated count
  ipcMain.handle('get-bonafide-generated-count', async (_, GRN) => {
    try {
      return await getBonafideGeneratedCount(GRN)
    } catch (error) {
      console.error('Error getting bonafide generated count:', error)
      throw error
    }
  })

  ipcMain.handle('get-leave-generated-count', async (_, GRN) => {
    try {
      return await getLeaveGeneratedCount(GRN)
    } catch (error) {
      console.error('Error getting leave generated count:', error)
      throw error
    }
  })

  // Add these new handlers
  ipcMain.handle(
    'save-certificate',
    async (_, GRN, type, data) => await saveCertificate(GRN, type, data)
  )
  ipcMain.handle(
    'get-latest-certificate',
    async (_, GRN, type) => await getLatestCertificate(GRN, type)
  )

  // Import data handler
  ipcMain.handle('import-data', handleImportData)

  // Add a new IPC handler for resolving duplicates
  ipcMain.handle('resolve-duplicates', (_, resolvedStudents) => resolveDuplicates(resolvedStudents))

  // New handlers for get-student-by-id and update-student
  ipcMain.handle('get-student-by-grn', async (event, GRN) => {
    try {
      const student = await getStudentByGRN(GRN);
      return student;
    } catch (error) {
      console.error('Error getting student by GRN:', error);
      throw error;
    }
  });

  ipcMain.handle('freeze-student', async (_, GRN) => {
    try {
      const student = await getStudentByGRN(GRN)
      const frozenStudent = { ...student, isFrozen: true }
      const updatedStudent = await updateStudent(GRN, frozenStudent)
      return updatedStudent
    } catch (error) {
      console.error('Error freezing student:', error)
      throw error
    }
  })

  ipcMain.handle('unfreeze-student', async (_, GRN) => {
    try {
      const student = await getStudentByGRN(GRN)
      const unfrozenStudent = { ...student, isFrozen: false }
      const updatedStudent = await updateStudent(GRN, unfrozenStudent)
      return updatedStudent
    } catch (error) {
      console.error('Error unfreezing student:', error)
      throw error
    }
  })
}

// App lifecycle events
app.whenReady().then(() => {
  // Initialize the database
  initializeDatabase().catch(console.error)

  // Set up IPC handlers
  setupIpcHandlers()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Set the app icon
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName())
  }

  // Use the icon.png as the app icon
  const iconPath = join(__dirname, '../../resources/icon.png')
  if (process.platform === 'win32') {
    app.setAsDefaultProtocolClient(app.getName())
  }
  if (process.platform === 'darwin') {
    app.dock.setIcon(iconPath)
  }

  createWindow()
})

// Remove or comment out this event handler
// app.on('will-quit', async () => {
//   await closeDatabase()
// })

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
