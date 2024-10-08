const Store = require('electron-store');

const store = new Store();

// Initialize the database
export const initializeDatabase = async () => {
  try {
    // Initialize certificate counters if they don't exist
    if (!store.has('certificate_counters')) {
      store.set('certificate_counters', {
        bonafide: { next_number: 1, generated_count: 0 },
        leave: { next_number: 1, generated_count: 0 }
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

export const getStudent = async (GRN) => {
  try {
    console.log('Getting student with GRN:', GRN);
    const students = store.get('students', []);
    const student = students.find(student => student.GRN === GRN);
    console.log('Found student:', student);
    return student;
  } catch (err) {
    console.error('Error getting student:', err);
    throw err;
  }
};

export const getStudentByGRN = async (GRN) => {
  try {
    const students = store.get('students', []);
    const student = students.find(s => s.GRN === GRN);
    if (!student) {
      throw new Error('Student not found');
    }
    return student;
  } catch (err) {
    console.error('Error getting student by GRN:', err);
    throw err;
  }
};

export const updateStudent = async (GRN, updatedStudent) => {
  try {
    console.log('Updating student with GRN:', GRN);
    console.log('Updated data:', updatedStudent);
    const students = store.get('students', []);
    const index = students.findIndex(student => student.GRN === GRN);
    if (index !== -1) {
      const existingStudent = await getStudentByGRN(GRN);
      students[index] = {
        ...existingStudent,
        ...updatedStudent,
        isFrozen: updatedStudent.isFrozen !== undefined ? updatedStudent.isFrozen : existingStudent.isFrozen,
        lastUpdated: new Date().toISOString()
      };
      store.set('students', students);
      console.log('Student updated successfully');
      return students[index];
    }
    console.log('Student not found');
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error updating student:', err);
    throw err;
  }
};

export const deleteStudent = async (GRN) => {
  try {
    console.log('Deleting student with GRN:', GRN);
    const students = store.get('students', []);
    console.log('Current number of students:', students.length);
    const updatedStudents = students.filter(student => student.GRN !== GRN);
    console.log('Number of students after filter:', updatedStudents.length);
    store.set('students', updatedStudents);
    console.log('Students updated in store');
    return GRN;
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

export const saveCertificate = async (GRN, type, data) => {
  try {
    const certificates = store.get('certificates', []);
    const certificate = { GRN, type, timestamp: Date.now(), data };
    certificates.push(certificate);
    store.set('certificates', certificates);
    return certificate;
  } catch (err) {
    console.error('Error saving certificate:', err);
    throw err;
  }
};

export const getLatestCertificate = async (GRN, type) => {
  try {
    const certificates = store.get('certificates', []);
    const typeCertificates = certificates.filter(cert => cert.GRN === GRN && cert.type === type);
    return typeCertificates.sort((a, b) => b.timestamp - a.timestamp)[0];
  } catch (err) {
    console.error('Error getting latest certificate:', err);
    throw err;
  }
};

// Modify these functions to work with individual student counters
export const incrementBonafideGeneratedCount = async (GRN) => {
  try {
    const students = store.get('students', []);
    const studentIndex = students.findIndex(s => s.GRN === GRN);
    if (studentIndex !== -1) {
      if (!students[studentIndex].bonafideGeneratedCount) {
        students[studentIndex].bonafideGeneratedCount = 0;
      }
      students[studentIndex].bonafideGeneratedCount += 1;
      store.set('students', students);
      return students[studentIndex].bonafideGeneratedCount;
    }
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error incrementing bonafide generated count:', err);
    throw err;
  }
};

export const getBonafideGeneratedCount = async (GRN) => {
  try {
    const students = store.get('students', []);
    const student = students.find(s => s.GRN === GRN);
    if (student) {
      return student.bonafideGeneratedCount || 0;
    }
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error getting bonafide generated count:', err);
    throw err;
  }
};

export const incrementLeaveGeneratedCount = async (GRN) => {
  try {
    const students = store.get('students', []);
    const studentIndex = students.findIndex(s => s.GRN === GRN);
    if (studentIndex !== -1) {
      if (!students[studentIndex].leaveGeneratedCount) {
        students[studentIndex].leaveGeneratedCount = 0;
      }
      students[studentIndex].leaveGeneratedCount += 1;
      store.set('students', students);
      return students[studentIndex].leaveGeneratedCount;
    }
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error incrementing leave generated count:', err);
    throw err;
  }
};

export const getLeaveGeneratedCount = async (GRN) => {
  try {
    const students = store.get('students', []);
    const student = students.find(s => s.GRN === GRN);
    if (student) {
      return student.leaveGeneratedCount || 0;
    }
    throw new Error('Student not found');
  } catch (err) {
    console.error('Error getting leave generated count:', err);
    throw err;
  }
};

// No need for a closeDatabase function with IndexedDB
