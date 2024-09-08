"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");

const api = {
  // Existing certificate generation functions
  generateDraftLeaveCertificate: (data) => electron.ipcRenderer.invoke("generate-draft-leave-certificate", data),
  generateOfficialLeaveCertificate: (data) => electron.ipcRenderer.invoke("generate-official-leave-certificate", data),
  generateDraftBonafideCertificate: (data) => electron.ipcRenderer.invoke("generate-draft-bonafide-certificate", data),
  generateOfficialBonafideCertificate: (data) => electron.ipcRenderer.invoke("generate-official-bonafide-certificate", data),

  // Updated database operations
  addStudent: (student) => electron.ipcRenderer.invoke("add-student", student),
  getStudents: () => electron.ipcRenderer.invoke("get-students"),
  getStudent: (studentId) => electron.ipcRenderer.invoke("get-student", studentId),
  updateStudent: (studentId, student) => electron.ipcRenderer.invoke("update-student", studentId, student),
  deleteStudent: (studentId) => electron.ipcRenderer.invoke("delete-student", studentId),

  // Certificate counter operations
  getNextCertificateNumber: (type) => electron.ipcRenderer.invoke("get-next-certificate-number", type),
  incrementCertificateCounter: (type) => electron.ipcRenderer.invoke("increment-certificate-counter", type),

  // Existing certificate save and retrieval functions
  saveCertificate: (studentId, type, data) => electron.ipcRenderer.invoke("save-certificate", studentId, type, data),
  getLatestCertificate: (studentId, type) => electron.ipcRenderer.invoke("get-latest-certificate", studentId, type)
};

if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
