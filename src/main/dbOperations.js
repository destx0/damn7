import sqlite3 from 'sqlite3'
import { app } from 'electron'
import path from 'path'

// Get the app path
const appPath = app.getAppPath()

// Define the database file path
const dbPath = path.join(appPath, 'students.sqlite')

// Create a new database connection
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT UNIQUE,
    aadharNo TEXT,
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
    admissionStandard TEXT
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    type TEXT,
    certificate_number INTEGER,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS certificate_counters (
    type TEXT PRIMARY KEY,
    next_number INTEGER DEFAULT 1
  )`)

  // Initialize certificate counters if they don't exist
  db.run(`INSERT OR IGNORE INTO certificate_counters (type, next_number) VALUES ('bonafide', 1)`)
  db.run(`INSERT OR IGNORE INTO certificate_counters (type, next_number) VALUES ('leave', 1)`)
})

export const addStudent = (student) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(student).join(', ')
    const placeholders = Object.keys(student)
      .map(() => '?')
      .join(', ')
    const values = Object.values(student)

    db.run(`INSERT INTO students (${fields}) VALUES (${placeholders})`, values, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, ...student })
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

export const updateStudent = (id, student) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(student)
      .map((key) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(student), id]

    db.run(`UPDATE students SET ${fields} WHERE id = ?`, values, function (err) {
      if (err) reject(err)
      else resolve({ id, ...student })
    })
  })
}

export const deleteStudent = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM students WHERE id = ?', [id], function (err) {
      if (err) reject(err)
      else resolve(id)
    })
  })
}

export const saveCertificate = (studentId, type, data) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get('SELECT next_number FROM certificate_counters WHERE type = ?', [type], (err, row) => {
        if (err) {
          reject(err)
          return
        }

        const certificateNumber = row.next_number

        db.run('BEGIN TRANSACTION')

        db.run(
          'INSERT INTO certificates (student_id, type, certificate_number, data) VALUES (?, ?, ?, ?)',
          [studentId, type, certificateNumber, JSON.stringify(data)],
          function (err) {
            if (err) {
              db.run('ROLLBACK')
              reject(err)
              return
            }

            db.run(
              'UPDATE certificate_counters SET next_number = next_number + 1 WHERE type = ?',
              [type],
              (err) => {
                if (err) {
                  db.run('ROLLBACK')
                  reject(err)
                  return
                }

                db.run('COMMIT')
                resolve({
                  id: this.lastID,
                  student_id: studentId,
                  type,
                  certificate_number: certificateNumber,
                  data
                })
              }
            )
          }
        )
      })
    })
  })
}

export const getLatestCertificate = (studentId, type) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM certificates WHERE student_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1',
      [studentId, type],
      (err, row) => {
        if (err) reject(err)
        else {
          if (row) {
            row.data = JSON.parse(row.data)
          }
          resolve(row)
        }
      }
    )
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
