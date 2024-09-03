import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from 'electron'
import path from 'path'

let mongoServer
let client
let db

// Get the app path
const appPath = app.getAppPath()

// Define the database file path
const dbPath = path.join(appPath, 'studentsDB')

// Create a new database connection


// Initialize the database
export const initializeDatabase = async () => {
  try {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    // Connect to the in-memory database
    client = new MongoClient(mongoUri)
    await client.connect()
    db = client.db('studentsDB')
    console.log('Database connected successfully')

    // Create collections if they don't exist
    await db.createCollection('students')
    await db.createCollection('certificate_counters')

    // Initialize certificate counters if they don't exist
    await db.collection('certificate_counters').updateOne(
      { type: 'bonafide' },
      { $setOnInsert: { next_number: 1 } },
      { upsert: true }
    )
    await db.collection('certificate_counters').updateOne(
      { type: 'leave' },
      { $setOnInsert: { next_number: 1 } },
      { upsert: true }
    )

    console.log('Database initialized successfully')
  } catch (err) {
    console.error('Error initializing database:', err)
    throw err
  }
}

export const addStudent = async (student) => {
  try {
    const result = await db.collection('students').insertOne(student)
    return { ...student, _id: result.insertedId }
  } catch (err) {
    console.error('Error adding student:', err)
    throw err
  }
}

export const getStudents = async () => {
  try {
    return await db.collection('students').find({}).toArray()
  } catch (err) {
    console.error('Error getting students:', err)
    throw err
  }
}

export const getStudent = async (studentId) => {
  try {
    return await db.collection('students').findOne({ studentId })
  } catch (err) {
    console.error('Error getting student:', err)
    throw err
  }
}

export const updateStudent = async (studentId, student) => {
  try {
    await db.collection('students').updateOne({ studentId }, { $set: student })
    return { studentId, ...student }
  } catch (err) {
    console.error('Error updating student:', err)
    throw err
  }
}

export const deleteStudent = async (studentId) => {
  try {
    await db.collection('students').deleteOne({ studentId })
    return studentId
  } catch (err) {
    console.error('Error deleting student:', err)
    throw err
  }
}

export const getNextCertificateNumber = async (type) => {
  try {
    const counter = await db.collection('certificate_counters').findOne({ type })
    return counter ? counter.next_number : 1
  } catch (err) {
    console.error('Error getting next certificate number:', err)
    throw err
  }
}

export const incrementCertificateCounter = async (type) => {
  try {
    await db.collection('certificate_counters').updateOne(
      { type },
      { $inc: { next_number: 1 } }
    )
  } catch (err) {
    console.error('Error incrementing certificate counter:', err)
    throw err
  }
}

// Clean up function to stop the MongoDB server when the app is closing
export const closeDatabase = async () => {
  if (client) {
    await client.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
}
