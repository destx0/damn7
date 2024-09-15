import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '@/assets/ag.css'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'
import LeaveForm from './LeaveForm'
import BonafideForm from './BonafideForm'
import { createColumnDefs } from './ColumnDefs'
import Header from '@/components/Header'
import { Toaster, toast } from 'react-hot-toast'
import DuplicateResolutionDialog from '@/components/DuplicateResolutionDialog'

const TablePage = () => {
  const [rowData, setRowData] = useState([])
  const [pdfDataUrl, setPdfDataUrl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const [certificateType, setCertificateType] = useState(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [quickFilterText, setQuickFilterText] = useState('')
  const navigate = useNavigate()
  const { user, userType, clearUser } = useUserStore()
  const [duplicateStudents, setDuplicateStudents] = useState(null)

  const fetchStudents = useCallback(async () => {
    try {
      const students = await window.api.getStudents()
      // Remove the lastUpdated field modification
      setRowData(students)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleEditStudent = useCallback(
    (student) => {
      if (userType === 'admin') {
        console.log('Editing student:', student);
        navigate(`/edit-student/${student.studentId}`, { state: { student } })
      }
    },
    [navigate, userType]
  )

  const handleDeleteStudent = useCallback(
    async (studentId) => {
      if (userType === 'admin') {
        try {
          console.log('Attempting to delete student with ID:', studentId);
          await window.api.deleteStudent(studentId);
          console.log('Student deleted successfully');
          setRowData((prevData) => prevData.filter((student) => student.studentId !== studentId));
        } catch (error) {
          console.error('Error deleting student:', error);
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
        navigate(`/leave-form/${data.studentId}`, { state: { pdfDataUrl: `data:application/pdf;base64,${base64Data}`, studentData: data } })
      } else if (type === 'bonafide') {
        base64Data = await window.api.generateDraftBonafideCertificate(data)
        navigate(`/bonafide-form/${data.studentId}`, { state: { pdfDataUrl: `data:application/pdf;base64,${base64Data}`, studentData: data } })
      } else {
        throw new Error('Unknown certificate type')
      }
    } catch (error) {
      console.error(`Error generating draft ${type} certificate:`, error)
    }
  }, [navigate])

  const handleStudentUpdate = useCallback((updatedStudent) => {
    setRowData((prevData) =>
      prevData.map((student) =>
        student.studentId === updatedStudent.studentId
          ? { ...student, ...updatedStudent, lastUpdated: new Date().toISOString() }
          : student
      )
    )
  }, [])

  const columnDefs = useMemo(
    () =>
      createColumnDefs(isAdmin, handleEditStudent, handleDeleteStudent, generateDraftCertificate),
    [isAdmin, handleEditStudent, handleDeleteStudent, generateDraftCertificate]
  )

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: false,
      width: 120,
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

  const onQuickFilterChanged = useCallback((e) => {
    setQuickFilterText(e.target.value)
  }, [])

  const handleRefresh = useCallback(() => {
    return new Promise(async (resolve) => {
      await fetchStudents()
      resolve()
    })
  }, [fetchStudents])

  const handleExportData = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const params = {
        fileName: 'student_data.csv',
        suppressQuotes: true,
        columnSeparator: ',',
      }

      // Check if columnApi is available
      if (gridRef.current.columnApi) {
        params.columnKeys = gridRef.current.columnApi.getAllColumns()
          .filter(column => column.colDef.field) // Only include columns with a field
          .map(column => column.getColId())
      }

      gridRef.current.api.exportDataAsCsv(params)
    } else {
      console.error('Grid API is not available')
    }
  }, [])

  const handleImportData = async () => {
    try {
      const result = await window.api.importData()
      if (result.success) {
        if (result.message.includes('Duplicate students found')) {
          // Duplicates will be handled by the event listener
        } else {
          toast.success(result.message)
          handleRefresh()
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error importing data:', error)
      toast.error('Failed to import data')
    }
  }

  const handleResolveDuplicates = async (resolvedStudents) => {
    try {
      const result = await window.api.resolveDuplicates(resolvedStudents)
      if (result.success) {
        toast.success(result.message)
        handleRefresh()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error resolving duplicates:', error)
      toast.error('Failed to resolve duplicates')
    } finally {
      setDuplicateStudents(null)
    }
  }

  const gridRef = useRef(null)

  useEffect(() => {
    // Listen for duplicate students event
    const handleDuplicateStudents = (_, duplicates) => {
      setDuplicateStudents(duplicates)
    }
    window.electron.ipcRenderer.on('duplicate-students-found', handleDuplicateStudents)

    return () => {
      window.electron.ipcRenderer.removeListener('duplicate-students-found', handleDuplicateStudents)
    }
  }, [])

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Toaster position="top-right" />
      <Header
        quickFilterText={quickFilterText}
        onQuickFilterChanged={onQuickFilterChanged}
        handleLogout={handleLogout}
        handleRefresh={handleRefresh}
        handleExportData={handleExportData}
        handleImportData={handleImportData}
      />
      <div className="flex-1 overflow-hidden">
        {!showCertificate ? (
          <div className="ag-theme-quartz w-full h-full text-sm">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              rowSelection={'multiple'}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              headerHeight={32}
              rowHeight={32}
              quickFilterText={quickFilterText}
            />
          </div>
        ) : (
          <div className="flex h-full">
            {certificateType === 'leave' ? (
              <LeaveForm
                studentData={selectedRow}
                pdfDataUrl={pdfDataUrl}
                closeCertificate={closeCertificate}
                onStudentUpdate={handleStudentUpdate}
              />
            ) : (
              <BonafideForm
                studentData={selectedRow}
                pdfDataUrl={pdfDataUrl}
                closeCertificate={closeCertificate}
                onStudentUpdate={handleStudentUpdate}
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
      {duplicateStudents && (
        <DuplicateResolutionDialog
          duplicates={duplicateStudents}
          onResolve={handleResolveDuplicates}
          onCancel={() => setDuplicateStudents(null)}
        />
      )}
    </div>
  )
}

export default TablePage
