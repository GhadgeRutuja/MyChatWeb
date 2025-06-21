import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage' 
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'


const App = () => {
  return (
    <div className="bg-[url('./src/assets/bg3.jpg')] bg-contain">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  )
}

export default App
