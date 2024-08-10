import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { writeFileSync } from 'fs'
import PDFWindow from 'electron-pdf-window'
import { jsPDF } from 'jspdf' // Corrected import

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // PDF generation and rendering
  ipcMain.handle('generate-certificate', (event, data) => {
    try {
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text('Certificate', 105, 20, { align: 'center' })
      doc.setFontSize(14)
      doc.text(`This is to certify that`, 105, 40, { align: 'center' })
      doc.setFontSize(18)
      doc.text(`${data.name}`, 105, 55, { align: 'center' })
      doc.setFontSize(14)
      doc.text(`Age: ${data.age}`, 105, 70, { align: 'center' })
      doc.text(`City: ${data.city}`, 105, 85, { align: 'center' })
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 100, { align: 'center' })

      const pdfBuffer = doc.output('arraybuffer')
      const tempPath = join(app.getPath('temp'), 'temp.pdf')
      writeFileSync(tempPath, Buffer.from(pdfBuffer))

      const win = new BrowserWindow({
        width: 800,
        height: 600
      })

      PDFWindow.addSupport(win)
      win.loadURL(`file://${tempPath}`)

      return 'PDF generated and displayed'
    } catch (error) {
      console.error('Error in generate-certificate:', error)
      throw error // Rethrow the error so it's sent back to the renderer
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
