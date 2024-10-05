import { dialog } from 'electron'
import fs from 'fs'
import csv from 'csv-parser'
import xlsx from 'xlsx'
import { addStudent, getStudent, updateStudent } from './dbOperations'

export const handleImportData = async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'csv'] }
      ]
    })

    if (filePaths.length === 0) return { success: false, message: 'No file selected' }

    const filePath = filePaths[0]
    const fileExtension = filePath.split('.').pop().toLowerCase()

    let data = []

    if (fileExtension === 'csv') {
      data = await new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', () => resolve(results))
          .on('error', reject)
      })
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      data = xlsx.utils.sheet_to_json(sheet)
    }

    let importedCount = 0
    let skippedCount = 0
    let duplicates = []

    for (const row of data) {
      const student = {
        GRN: row['GRN'] || '',
        PENNo: row['PEN No'] || '',
        aadharNo: row['Aadhar No'] || '',
        name: row['Name'] || '',
        surname: row['Surname'] || '',
        fathersName: row["Father's Name"] || '',
        mothersName: row["Mother's Name"] || '',
        religion: row['Religion'] || '',
        caste: row['Caste'] || '',
        subCaste: row['Sub Caste'] || '',
        placeOfBirth: row['Place of Birth'] || '',
        taluka: row['Taluka'] || '',
        district: row['District'] || '',
        state: row['State'] || '',
        dateOfBirth: row['Date of Birth'] || '',
        lastAttendedSchool: row['Last Attended School'] || '',
        lastSchoolStandard: row['Last School Standard'] || '',
        dateOfAdmission: row['Date of Admission'] || '',
        admissionStandard: row['Admission Standard'] || '',
        nationality: row['Nationality'] || '',
        motherTongue: row['Mother Tongue'] || '',
        currentStandard: row['Current Standard'] || '',
        progress: row['Progress'] || '',
        conduct: row['Conduct'] || '',
        dateOfLeaving: row['Date of Leaving'] || '',
        reasonOfLeaving: row['Reason of Leaving'] || '',
        remarks: row['Remarks'] || '',
        leaveCertificateGenerationDate: row['Leave Certificate Date'] || '',
        sscExamYear: row['SSC Exam Year'] || '',
        sscPassStatus: row['SSC Pass Status'] || '',
        academicYear: row['Academic Year'] || '',
        reasonOfBonafide: row['Bonafide Reason'] || '',
        requestOfBonafideBy: row['Bonafide Requested By'] || '',
        dateOfBonafide: row['Bonafide Date'] || '',
        bonafideStandard: row['Bonafide Standard'] || ''
      }

      // Only process the student if at least one field is non-empty
      if (Object.values(student).some(value => value !== '')) {
        const existingStudent = await getStudent(student.GRN)

        if (existingStudent) {
          duplicates.push(student)
        } else {
          // New student, add to database
          await addStudent(student)
          importedCount++
        }
      }
    }

    if (duplicates.length > 0) {
      // Send an event to the renderer process with the duplicate students
      event.sender.send('duplicate-students-found', duplicates)
      return { success: true, message: 'Duplicate students found. Please resolve conflicts.' }
    }

    return {
      success: true,
      message: `Imported ${importedCount} students successfully. Skipped ${skippedCount} students.`
    }
  } catch (error) {
    console.error('Error importing data:', error)
    return { success: false, message: 'Error importing data: ' + error.message }
  }
}

export const resolveDuplicates = async (resolvedStudents) => {
  try {
    let importedCount = 0
    let skippedCount = 0

    for (const student of resolvedStudents) {
      if (student.action === 'replace') {
        await updateStudent(student.GRN, student)
        importedCount++
      } else if (student.action === 'keep') {
        skippedCount++
      }
    }

    return {
      success: true,
      message: `Imported ${importedCount} students successfully. Skipped ${skippedCount} students.`
    }
  } catch (error) {
    console.error('Error resolving duplicates:', error)
    return { success: false, message: 'Error resolving duplicates: ' + error.message }
  }
}
