import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  generateLeaveCertificate: (data) => ipcRenderer.invoke('generate-leave-certificate', data),
  printLeaveCertificate: (data) => ipcRenderer.invoke('print-leave-certificate', data),
  generateBonafideCertificate: (data) => ipcRenderer.invoke('generate-bonafide-certificate', data),
  printBonafideCertificate: (data) => ipcRenderer.invoke('print-bonafide-certificate', data),
  addStudent: (student) => ipcRenderer.invoke('add-student', student),
  getStudents: () => ipcRenderer.invoke('get-students'),
  updateStudent: (id, student) => ipcRenderer.invoke('update-student', id, student),
  deleteStudent: (id) => ipcRenderer.invoke('delete-student', id)
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
