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
  getStudent: (GRN) => ipcRenderer.invoke("get-student", GRN),
  updateStudent: (GRN, student) => ipcRenderer.invoke("update-student", GRN, student),
  deleteStudent: (GRN) => ipcRenderer.invoke("delete-student", GRN),

  // Certificate counter operations
  getNextCertificateNumber: (type) => ipcRenderer.invoke("get-next-certificate-number", type),
  incrementCertificateCounter: (type) => ipcRenderer.invoke("increment-certificate-counter", type),

  // Existing certificate save and retrieval functions
  saveCertificate: (GRN, type, data) => ipcRenderer.invoke("save-certificate", GRN, type, data),
  getLatestCertificate: (GRN, type) => ipcRenderer.invoke("get-latest-certificate", GRN, type),

  // Import function
  importData: () => ipcRenderer.invoke('import-data'),

  // Add the resolveDuplicates function
  resolveDuplicates: (resolvedStudents) => ipcRenderer.invoke('resolve-duplicates', resolvedStudents),

  getStudentByGRN: (GRN) => ipcRenderer.invoke("get-student-by-grn", GRN),

  // Add these new functions for bonafide generated count
  getBonafideGeneratedCount: (GRN) => ipcRenderer.invoke("get-bonafide-generated-count", GRN),
  incrementBonafideGeneratedCount: () => ipcRenderer.invoke("increment-bonafide-generated-count"),

  // Add these new functions for leave generated count
  getLeaveGeneratedCount: (GRN) => ipcRenderer.invoke("get-leave-generated-count", GRN),
  incrementLeaveGeneratedCount: () => ipcRenderer.invoke("increment-leave-generated-count"),

  // New functions for freeze/unfreeze
  freezeStudent: (GRN) => ipcRenderer.invoke("freeze-student", GRN),
  unfreezeStudent: (GRN) => ipcRenderer.invoke("unfreeze-student", GRN),
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
