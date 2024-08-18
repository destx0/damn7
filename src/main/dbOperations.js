import sqlite3 from 'sqlite3'
import { app } from 'electron'
import path from 'path'

// Get the app path
const appPath = app.getAppPath()

// Define the database file path
const dbPath = path.join(appPath, 'students.sqlite')

// Create a new database connection
let db

// Initialize the database
export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err)
        reject(err)
      } else {
        console.log('Database connected successfully')
        db.serialize(() => {
          db.run(`CREATE TABLE IF NOT EXISTS students (
            studentId TEXT PRIMARY KEY,
            aadharNo TEXT,
            PENNo TEXT,
            name TEXT,
            surname TEXT,
            fathersName TEXT,
            mothersName TEXT,
            religion TEXT,
            caste TEXT,
            subCaste TEXT,
            placeOfBirth TEXT,
            taluka TEXT,
            district TEXT,
            state TEXT,
            dateOfBirth TEXT,
            lastAttendedSchool TEXT,
            lastSchoolStandard TEXT,
            dateOfAdmission TEXT,
            admissionStandard TEXT,
            nationality TEXT,
            motherTongue TEXT,
            grn TEXT,
            ten TEXT,
            currentStandard TEXT,
            progress TEXT,
            conduct TEXT,
            dateOfLeaving TEXT,
            reasonOfLeaving TEXT,
            remarks TEXT,
            leaveCertificateGenerationDate TEXT
          )`)

          db.run(`CREATE TABLE IF NOT EXISTS certificate_counters (
            type TEXT PRIMARY KEY,
            next_number INTEGER DEFAULT 1
          )`)

          // Initialize certificate counters if they don't exist
          db.run(
            `INSERT OR IGNORE INTO certificate_counters (type, next_number) VALUES ('bonafide', 1)`
          )
          db.run(
            `INSERT OR IGNORE INTO certificate_counters (type, next_number) VALUES ('leave', 1)`,
            (err) => {
              if (err) {
                console.error('Error initializing certificate counters:', err)
                reject(err)
              } else {
                console.log('Database initialized successfully')
                resolve()
              }
            }
          )
        })
      }
    })
  })
}

export const addStudent = (student) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(student).join(', ')
    const placeholders = Object.keys(student)
      .map(() => '?')
      .join(', ')
    const values = Object.values(student)

    db.run(`INSERT INTO students (${fields}) VALUES (${placeholders})`, values, function (err) {
      if (err) reject(err)
      else resolve(student)
    })
  })
}

export const getStudents = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM students', (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export const getStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM students WHERE studentId = ?', [studentId], (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export const updateStudent = (studentId, student) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(student)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(student), studentId]

    db.run(`UPDATE students SET ${fields} WHERE studentId = ?`, values, function (err) {
      if (err) reject(err)
      else resolve({ studentId, ...student })
    })
  })
}

export const deleteStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM students WHERE studentId = ?', [studentId], function (err) {
      if (err) reject(err)
      else resolve(studentId)
    })
  })
}

export const getNextCertificateNumber = (type) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT next_number FROM certificate_counters WHERE type = ?', [type], (err, row) => {
      if (err) reject(err)
      else resolve(row ? row.next_number : 1)
    })
  })
}

export const incrementCertificateCounter = (type) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE certificate_counters SET next_number = next_number + 1 WHERE type = ?',
      [type],
      function (err) {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}
