import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
    } else {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className='border w-full h-screen sm:px-[10%] sm:py-[3%]'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} currentUser={currentUser} />
        <ChatContainer selectedUser={selectedUser} currentUser={currentUser} />
       
        {selectedUser && <RightSidebar selectedUser={selectedUser} currentUser={currentUser} />}
      </div>
    </div>
  )
}

export default HomePage