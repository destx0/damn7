"use strict";
const { contextBridge, ipcRenderer } = require('electron');
const { electronAPI } = require('@electron-toolkit/preload');

// Custom API for renderer
const api = {
  // Existing certificate generation functions
  generateDraftLeaveCertificate: (data) => ipcRenderer.invoke("generate-draft-leave-certificate", data),
  generateOfficialLeaveCertificate: (data) => ipcRenderer.invoke("generate-official-leave-certificate", data),
  generateDraftBonafideCertificate: (data) => ipcRenderer.invoke("generate-draft-bonafide-certificate", data),
  generateOfficialBonafideCertificate: (data) => ipcRenderer.invoke("generate-official-bonafide-certificate", data),

  // Updated database operations
  addStudent: (student) => ipcRenderer.invoke("add-student", student),
  getStudents: () => ipcRenderer.invoke("get-students"),
  getStudent: (studentId) => ipcRenderer.invoke("get-student", studentId),
  updateStudent: (studentId, student) => ipcRenderer.invoke("update-student", studentId, student),
  deleteStudent: (studentId) => ipcRenderer.invoke("delete-student", studentId),

  // Certificate counter operations
  getNextCertificateNumber: (type) => ipcRenderer.invoke("get-next-certificate-number", type),
  incrementCertificateCounter: (type) => ipcRenderer.invoke("increment-certificate-counter", type),

  // Existing certificate save and retrieval functions
  saveCertificate: (studentId, type, data) => ipcRenderer.invoke("save-certificate", studentId, type, data),
  getLatestCertificate: (studentId, type) => ipcRenderer.invoke("get-latest-certificate", studentId, type),

  // Import function
  importData: () => ipcRenderer.invoke('import-data'),

  // Add the resolveDuplicates function
  resolveDuplicates: (resolvedStudents) => ipcRenderer.invoke('resolve-duplicates', resolvedStudents)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
