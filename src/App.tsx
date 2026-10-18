import { HashRouter, Navigate, Route, Routes } from 'react-router'
import Login from './pages/Login.tsx'
import PasteBin from './pages/PasteBin.tsx'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pastebin" element={<PasteBin />} />
      </Routes>
    </HashRouter>
  )
}

export default App
