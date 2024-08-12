import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import LoginPage from './pages/loginPage'
import Dashboard from './pages/dashboard'
import TablePage from './pages/tablePage'
import AddStudentPage from './pages/addStudentPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
      </Routes>
    </Router>
  )
}

export default App
