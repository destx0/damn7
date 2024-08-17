import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'
import createColumnDefs from '@/utils/columnDefs'
import PDFViewer from './PDFViewer'

const TablePage = () => {
  const [rowData, setRowData] = useState([])
  const [pdfDataUrl, setPdfDataUrl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [certificateType, setCertificateType] = useState(null)
  const [isFullView, setIsFullView] = useState(false)
  const navigate = useNavigate()
  const { user, userType, clearUser } = useUserStore()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const students = await window.api.getStudents()
      setRowData(students)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleEditStudent = useCallback(
    (student) => {
      navigate(`/edit-student/${student.id}`, { state: { student } })
    },
    [navigate]
  )

  const handleDeleteStudent = useCallback(async (id) => {
    try {
      await window.api.deleteStudent(id)
      setRowData((prevData) => prevData.filter((student) => student.id !== id))
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }, [])

  const isAdmin = userType === 'admin'

  const generateCertificate = useCallback(async (data, type) => {
    try {
      const base64Data = await (type === 'leave'
        ? window.api.generateLeaveCertificate(data)
        : window.api.generateBonafideCertificate(data))
      const dataUrl = `data:application/pdf;base64,${base64Data}`
      setPdfDataUrl(dataUrl)
      setSelectedRow(data)
      setCertificateType(type)
    } catch (error) {
      console.error(`Error generating ${type} certificate:`, error)
    }
  }, [])

  const columnDefs = useMemo(
    () => createColumnDefs(isAdmin, handleEditStudent, handleDeleteStudent, generateCertificate),
    [isAdmin, handleEditStudent, handleDeleteStudent, generateCertificate]
  )

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true
    }),
    []
  )

  const onCellValueChanged = useCallback((event) => {
    console.log(`Cell value changed: ${event.colDef.field} = ${event.newValue}`)
  }, [])

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  const toggleFullView = () => {
    setIsFullView(!isFullView)
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Student Certificates</h1>
        <div>
          <Button onClick={() => navigate('/add-student')} className="mr-2">
            Add Student
          </Button>
          <span className="mr-4">
            Logged in as: {user} ({userType})
          </span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {!isFullView && (
          <div className="flex-1 overflow-auto">
            <div className="ag-theme-alpine h-full w-full">
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onCellValueChanged={onCellValueChanged}
              />
            </div>
          </div>
        )}
        {pdfDataUrl && (
          <PDFViewer
            pdfDataUrl={pdfDataUrl}
            certificateType={certificateType}
            isFullView={isFullView}
            toggleFullView={toggleFullView}
          />
        )}
      </div>
      {!isAdmin && (
        <div className="p-4 bg-red-100 text-red-700">Note: Only admins can edit student data.</div>
      )}
    </div>
  )
}

export default TablePage
