import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, LogOut, Search, RefreshCw, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'

const Header = ({ quickFilterText, onQuickFilterChanged, handleLogout, handleRefresh, handleExportData }) => {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshClick = async () => {
    setIsRefreshing(true)
    const startTime = Date.now()
    await handleRefresh()
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(2000 - elapsedTime, 0)
    setTimeout(() => {
      setIsRefreshing(false)
    }, remainingTime)
  }

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Search className="h-4 w-4 mr-2" />
          <Input
            type="text"
            placeholder="Quick filter..."
            value={quickFilterText}
            onChange={onQuickFilterChanged}
            className="px-2 py-1 text-black"
          />
        </div>
        <Button
          onClick={() => navigate('/add-student')}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-700"
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </Button>
        <Button
          onClick={handleExportData}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-700"
        >
          <Download size={18} />
          <span>Export Data</span>
        </Button>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-700"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
        <Button
          onClick={handleRefreshClick}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-700"
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
      </div>
    </header>
  )
}

export default Header
