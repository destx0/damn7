import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'

const TablePage = () => {
  const [rowData, setRowData] = useState([])
  const navigate = useNavigate()
  const { user, userType, clearUser } = useUserStore()

  useEffect(() => {
    // Fetch data or set initial data
    setRowData([
      { id: 1, name: 'John Doe', age: 35, city: 'New York' },
      { id: 2, name: 'Jane Smith', age: 28, city: 'Los Angeles' },
      { id: 3, name: 'Bob Johnson', age: 42, city: 'Chicago' }
    ])
  }, [])

  const isAdmin = userType === 'admin'

  const columnDefs = useMemo(
    () => [
      { field: 'id', editable: false },
      { field: 'name', editable: isAdmin },
      { field: 'age', editable: isAdmin },
      { field: 'city', editable: isAdmin }
    ],
    [isAdmin]
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
    // Here you would typically update your backend or state management
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Data Table</h1>
        <div>
          <span className="mr-4">
            Logged in as: {user} ({userType})
          </span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
      {!isAdmin && <p className="mt-4 text-red-500">Note: Only admins can edit this data.</p>}
    </div>
  )
}

export default TablePage
