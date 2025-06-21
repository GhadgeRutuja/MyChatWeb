import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Sidebar = ({ selectedUser, setSelectedUser, currentUser }) => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`https://mychatweb-production.up.railway.app/api/users?email=${currentUser.email}`)
        .then(res => setUserList(res.data))
        .catch(() => setUserList([]))
    }
  }, [currentUser])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const filteredUsers = userList.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`bg-[#18122B]/70 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='p-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.title} alt='logo' className='max-w-15' />
          <div className="relative py-2 group">
            <img src={assets.menu_icon} alt='menu' className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p className='cursor-pointer text-sm' onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search User..."
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          />
        </div>
      </div>
      <div className='flex flex-col'>
        {filteredUsers.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No users found.</div>
        )}
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => setSelectedUser(user)}
            key={user._id}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser && selectedUser._id === user._id ? 'bg-[#282142]/50' : ''}`}
          >
            <img
  src={user.profilePic ? `https://mychatweb-production.up.railway.app${encodeURI(user.profilePic)}` : assets.avatar_icon}
  alt={user.fullName}
  className='w-[35px] aspect-[1/1] rounded-full'
/>
            <div className='flex flex-col leading-5'>
              <p className="text-white">{user.fullName}</p>
              <span className='text-green-500 text-xs'>Online</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar