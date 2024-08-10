const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  receivePdfData: (callback) => ipcRenderer.on('pdf-data', (event, data) => callback(data)),
  printCertificate: () => ipcRenderer.invoke('print-certificate')
})
