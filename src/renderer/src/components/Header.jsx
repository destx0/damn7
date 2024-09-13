import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, LogOut, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'

const Header = ({ quickFilterText, onQuickFilterChanged, handleLogout }) => {
  const navigate = useNavigate()

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
          onClick={handleLogout}
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-700"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default Header
