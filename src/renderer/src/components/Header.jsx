/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, LogOut, Search, RefreshCw, Download, Upload, FileDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/stores/useUserStore'
import logo from '@/assets/logo.png'

const Header = ({
  quickFilterText,
  onQuickFilterChanged,
  handleLogout,
  handleRefresh,
  handleExportData,
  handleExportPDF,
  handleImportData
}) => {
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { userType } = useUserStore()

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
    <header className="bg-white shadow-sm">
      {/* Modern gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

      <div className="px-5 py-2.5 flex items-center justify-between">
        {/* Left side - Logo with proper aspect ratio */}
        <div className="flex items-center">
          <img src={logo} alt="School Logo" className="h-12 w-auto object-contain" />
        </div>

        {/* Center - Search bar */}
        <div className="max-w-lg w-full mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search students..."
              value={quickFilterText}
              onChange={onQuickFilterChanged}
              className="pl-9 pr-4 py-2 h-9 w-full bg-gray-50 border border-gray-100 rounded-full shadow-sm text-sm focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-400/40 transition-all"
            />
          </div>
        </div>

        {/* Right side - Action buttons with modern gradients */}
        <div className="flex items-center gap-2">
          {/* Primary action button */}
          <Button
            onClick={() => navigate('/add-student')}
            variant="default"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full h-8 flex items-center px-3 shadow-sm transition-all"
          >
            <UserPlus size={15} className="mr-1.5" />
            <span className="text-xs font-medium whitespace-nowrap">Add Student</span>
          </Button>

          {/* Admin actions in a compact group */}
          {userType === 'admin' && (
            <div className="flex bg-gray-50 rounded-full p-0.5 shadow-sm border border-gray-100">
              <Button
                onClick={handleExportData}
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white"
                title="Export as CSV"
              >
                <Download size={14} />
              </Button>

              <Button
                onClick={handleExportPDF}
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-white"
                title="Export as PDF"
              >
                <FileDown size={14} />
              </Button>

              <Button
                onClick={handleImportData}
                variant="ghost"
                className="rounded-full h-7 w-7 p-0 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-white"
                title="Import data"
              >
                <Upload size={14} />
              </Button>
            </div>
          )}

          {/* Utility buttons */}
          <Button
            onClick={handleRefreshClick}
            variant="ghost"
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500"
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500"
            title="Logout"
          >
            <LogOut size={15} />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
