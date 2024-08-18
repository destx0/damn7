import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '@/assets/ag.css'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'
import LeaveForm from './LeaveForm'
import BonafideForm from './BonafideForm'
import { createColumnDefs } from './columnDefs'
import { UserCircle, LogOut, UserPlus } from 'lucide-react'

const TablePage = () => {
  const [rowData, setRowData] = useState([])
  const [pdfDataUrl, setPdfDataUrl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [certificateType, setCertificateType] = useState(null)
  const [showCertificate, setShowCertificate] = useState(false)
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
      if (userType === 'admin') {
        navigate(`/edit-student/${student.id}`, { state: { student } })
      }
    },
    [navigate, userType]
  )

  const handleDeleteStudent = useCallback(
    async (id) => {
      if (userType === 'admin') {
        try {
          await window.api.deleteStudent(id)
          setRowData((prevData) => prevData.filter((student) => student.id !== id))
        } catch (error) {
          console.error('Error deleting student:', error)
        }
      }
    },
    [userType]
  )

  const isAdmin = userType === 'admin'

  const generateDraftCertificate = useCallback(async (data, type) => {
    try {
      let base64Data
      if (type === 'leave') {
        base64Data = await window.api.generateDraftLeaveCertificate(data)
      } else if (type === 'bonafide') {
        base64Data = await window.api.generateDraftBonafideCertificate(data)
      } else {
        throw new Error('Unknown certificate type')
      }
      const dataUrl = `data:application/pdf;base64,${base64Data}`
      setPdfDataUrl(dataUrl)
      setSelectedRow(data)
      setCertificateType(type)
      setShowCertificate(true)
    } catch (error) {
      console.error(`Error generating draft ${type} certificate:`, error)
    }
  }, [])

  const columnDefs = useMemo(
    () =>
      createColumnDefs(isAdmin, handleEditStudent, handleDeleteStudent, generateDraftCertificate),
    [isAdmin, handleEditStudent, handleDeleteStudent, generateDraftCertificate]
  )

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable: false
    }),
    []
  )

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  const closeCertificate = () => {
    setShowCertificate(false)
    setPdfDataUrl(null)
    setSelectedRow(null)
    setCertificateType(null)
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
        <h1 className="text-2xl font-bold">Student Certificates</h1>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/add-student')}
            variant="ghost"
            className="flex items-center space-x-2 hover:bg-gray-700"
          >
            <UserPlus size={18} />
            <span>Add Student</span>
          </Button>
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded-full">
            <UserCircle size={18} />
            <span>
              {user} ({userType})
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex items-center space-x-2 hover:bg-gray-700"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        {!showCertificate ? (
          <div className="ag-theme-quartz w-full h-full text-sm">
            <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={defaultColDef} />
          </div>
        ) : (
          <div className="flex h-full">
            {certificateType === 'leave' ? (
              <LeaveForm
                studentData={selectedRow}
                pdfDataUrl={pdfDataUrl}
                closeCertificate={closeCertificate}
              />
            ) : (
              <BonafideForm
                studentData={selectedRow}
                pdfDataUrl={pdfDataUrl}
                closeCertificate={closeCertificate}
              />
            )}
          </div>
        )}
      </div>
      {!isAdmin && (
        <div className="p-4 bg-red-100 text-red-700">
          Note: Only admins can edit or delete student data.
        </div>
      )}
    </div>
  )
}

export default TablePage
