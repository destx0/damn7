import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, LogOut, Search, RefreshCw, Download, Upload, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import useUserStore from '@/stores/useUserStore'

const Header = ({
  quickFilterText,
  onQuickFilterChanged,
  handleLogout,
  handleRefresh,
  handleExportData,
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
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-10 mr-3" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Quick filter..."
            value={quickFilterText}
            onChange={onQuickFilterChanged}
            className="pl-10 pr-4 py-2 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={() => navigate('/add-student')}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-slate-600 rounded-full px-4 py-2 text-slate-200"
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </Button>
        <Button
          onClick={handleRefreshClick}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-slate-600 rounded-full px-4 py-2 text-slate-200"
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-slate-600 rounded-full p-2">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-700 text-slate-100 border-slate-600">
            {userType === 'admin' && (
              <>
                <DropdownMenuItem onClick={handleExportData} className="hover:bg-slate-600">
                  <Download size={16} className="mr-2" />
                  <span>Export Data</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportData} className="hover:bg-slate-600">
                  <Upload size={16} className="mr-2" />
                  <span>Import Data</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-slate-600">
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Header
