import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import LoginPage from './pages/loginPage'
import TablePage from './pages/tablePage/TablePage'
import StudentFormPage from './pages/studentFormPage'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/add-student" element={<StudentFormPage />} />
        <Route path="/edit-student/:id" element={<StudentFormPage />} />
      </Routes>
    </Router>
  )
}

export default App
