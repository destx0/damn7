import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import LoginPage from './pages/loginPage'
import TablePage from './pages/tablePage/TablePage'
import StudentFormPage from './pages/studentFormPage'
import LeaveFormPage from './pages/LeaveFormPage'
import BonafideFormPage from './pages/BonafideFormPage'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/add-student" element={<StudentFormPage />} />
        <Route path="/edit-student/:studentId" element={<StudentFormPage />} />
        <Route path="/leave-form/:studentId" element={<LeaveFormPage />} />
        <Route path="/bonafide-form/:studentId" element={<BonafideFormPage />} />
      </Routes>
    </Router>
  )
}

export default App
