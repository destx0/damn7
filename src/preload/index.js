import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  generateDraftLeaveCertificate: (data) =>
    ipcRenderer.invoke('generate-draft-leave-certificate', data),
  generateOfficialLeaveCertificate: (data) =>
    ipcRenderer.invoke('generate-official-leave-certificate', data),
  generateDraftBonafideCertificate: (data) =>
    ipcRenderer.invoke('generate-draft-bonafide-certificate', data),
  generateOfficialBonafideCertificate: (data) =>
    ipcRenderer.invoke('generate-official-bonafide-certificate', data),
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
