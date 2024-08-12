import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  generateLeaveCertificate: (data) => ipcRenderer.invoke('generate-leave-certificate', data),
  printLeaveCertificate: (data) => ipcRenderer.invoke('print-leave-certificate', data),
  generateBonafideCertificate: (data) => ipcRenderer.invoke('generate-bonafide-certificate', data),
  printBonafideCertificate: (data) => ipcRenderer.invoke('print-bonafide-certificate', data)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
