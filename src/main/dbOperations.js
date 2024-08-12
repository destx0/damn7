// src/main/dbOperations.js
import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { join } from 'path'

const db = new sqlite3.Database(join(app.getPath('userData'), 'students.db'))

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    grade TEXT
  )`)
})

export const addStudent = (student) => {
  return new Promise((resolve, reject) => {
    const { name, age, grade } = student
    db.run(
      'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)',
      [name, age, grade],
      function (err) {
        if (err) reject(err)
        else resolve({ id: this.lastID, ...student })
      }
    )
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
    const { name, age, grade } = student
    db.run(
      'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?',
      [name, age, grade, id],
      function (err) {
        if (err) reject(err)
        else resolve({ id, ...student })
      }
    )
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
