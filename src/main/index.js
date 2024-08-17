import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { generateLeaveCertificate } from './leaveCertificateGenerator'
import { generateBonafideCertificate } from './bonafideCertificateGenerator'
import { addStudent, getStudents, updateStudent, deleteStudent } from './dbOperations'

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

  ipcMain.handle('generate-leave-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateLeaveCertificate(data, true)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating leave certificate:', error)
      throw error
    }
  })

  ipcMain.handle('print-leave-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateLeaveCertificate(data, false)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error printing leave certificate:', error)
      throw error
    }
  })

  ipcMain.handle('generate-bonafide-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateBonafideCertificate(data, true)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error generating bonafide certificate:', error)
      throw error
    }
  })

  ipcMain.handle('print-bonafide-certificate', async (_, data) => {
    try {
      const pdfBuffer = await generateBonafideCertificate(data, false)
      return Buffer.from(pdfBuffer).toString('base64')
    } catch (error) {
      console.error('Error printing bonafide certificate:', error)
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
