const Store = require('electron-store');

const store = new Store();

// Initialize the database
export const initializeDatabase = async () => {
  try {
    // Initialize certificate counters if they don't exist
    if (!store.has('certificate_counters')) {
      store.set('certificate_counters', {
        bonafide: { next_number: 1 },
        leave: { next_number: 1 }
      });
    }
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

export const addStudent = async (student) => {
  try {
    const students = store.get('students', []);
    students.push(student);
    store.set('students', students);
    return student;
  } catch (err) {
    console.error('Error adding student:', err);
    throw err;
  }
};

export const getStudents = async () => {
  try {
    return store.get('students', []);
  } catch (err) {
    console.error('Error getting students:', err);
    throw err;
  }
};

export const getStudent = async (studentId) => {
  try {
    const students = store.get('students', []);
    return students.find(student => student.studentId === studentId);
  } catch (err) {
    console.error('Error getting student:', err);
    throw err;
  }
};

export const updateStudent = async (studentId, updatedStudent) => {
  try {
    const students = store.get('students', []);
    const index = students.findIndex(student => student.studentId === studentId);
    if (index !== -1) {
      students[index] = { ...students[index], ...updatedStudent };
      store.set('students', students);
      return students[index];
    }
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error updating student:', err);
    throw err;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    console.log('Deleting student with ID:', studentId);
    const students = store.get('students', []);
    console.log('Current number of students:', students.length);
    const updatedStudents = students.filter(student => student.studentId !== studentId);
    console.log('Number of students after filter:', updatedStudents.length);
    store.set('students', updatedStudents);
    console.log('Students updated in store');
    return studentId;
  } catch (err) {
    console.error('Error deleting student:', err);
    throw err;
  }
};

export const getNextCertificateNumber = async (type) => {
  try {
    const counters = store.get('certificate_counters');
    return counters[type].next_number;
  } catch (err) {
    console.error('Error getting next certificate number:', err);
    throw err;
  }
};

export const incrementCertificateCounter = async (type) => {
  try {
    const counters = store.get('certificate_counters');
    counters[type].next_number += 1;
    store.set('certificate_counters', counters);
  } catch (err) {
    console.error('Error incrementing certificate counter:', err);
    throw err;
  }
};

export const saveCertificate = async (studentId, type, data) => {
  try {
    const certificates = store.get('certificates', []);
    const certificate = { studentId, type, timestamp: Date.now(), data };
    certificates.push(certificate);
    store.set('certificates', certificates);
    return certificate;
  } catch (err) {
    console.error('Error saving certificate:', err);
    throw err;
  }
};

export const getLatestCertificate = async (studentId, type) => {
  try {
    const certificates = store.get('certificates', []);
    const typeCertificates = certificates.filter(cert => cert.studentId === studentId && cert.type === type);
    return typeCertificates.sort((a, b) => b.timestamp - a.timestamp)[0];
  } catch (err) {
    console.error('Error getting latest certificate:', err);
    throw err;
  }
};

// No need for a closeDatabase function with IndexedDB
