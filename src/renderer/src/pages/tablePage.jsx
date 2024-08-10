import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'

const TablePage = () => {
  const [rowData, setRowData] = useState([])
  const [pdfDataUrl, setPdfDataUrl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)
  const navigate = useNavigate()
  const { user, userType, clearUser } = useUserStore()

  useEffect(() => {
    setRowData([
      { id: 1, name: 'John Doe', age: 35, city: 'New York' },
      { id: 2, name: 'Jane Smith', age: 28, city: 'Los Angeles' },
      { id: 3, name: 'Bob Johnson', age: 42, city: 'Chicago' }
    ])
  }, [])

  const isAdmin = userType === 'admin'

  const createDataUrl = useCallback((base64Data) => {
    return `data:application/pdf;base64,${base64Data}`
  }, [])

  const generateCertificate = useCallback(
    async (data) => {
      try {
        const base64Data = await window.api.generateCertificate(data)
        const dataUrl = createDataUrl(base64Data)
        setPdfDataUrl(dataUrl)
        setSelectedRow(data)
      } catch (error) {
        console.error('Error generating certificate:', error)
      }
    },
    [createDataUrl]
  )

  const printCertificate = useCallback(async () => {
    if (!selectedRow) return
    try {
      const { certificateNumber, pdfBase64 } = await window.api.printCertificate(selectedRow)
      console.log(`Certificate printed. New certificate number: ${certificateNumber}`)

      const newDataUrl = createDataUrl(pdfBase64)
      setPdfDataUrl(newDataUrl)
    } catch (error) {
      console.error('Error printing certificate:', error)
    }
  }, [selectedRow, createDataUrl])

  const columnDefs = useMemo(
    () => [
      { field: 'id', editable: false },
      { field: 'name', editable: isAdmin },
      { field: 'age', editable: isAdmin },
      { field: 'city', editable: isAdmin },
      {
        headerName: 'Actions',
        cellRenderer: (params) => (
          <Button onClick={() => generateCertificate(params.data)}>View Certificate</Button>
        )
      }
    ],
    [isAdmin, generateCertificate]
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

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Data Table</h1>
        <div>
          <span className="mr-4">
            Logged in as: {user} ({userType})
          </span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
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
        {pdfDataUrl && (
          <div className="w-1/2 p-4 overflow-auto">
            <h2 className="text-xl mb-2">Certificate Preview</h2>
            <Button onClick={printCertificate} className="mb-2">
              Print Certificate
            </Button>
            <iframe src={pdfDataUrl} className="w-full h-[calc(100%-80px)] border-none" />
          </div>
        )}
      </div>
      {!isAdmin && (
        <div className="p-4 bg-red-100 text-red-700">Note: Only admins can edit this data.</div>
      )}
    </div>
  )
}

export default TablePage
