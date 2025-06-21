import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : {}
  })
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState(user)
  const [picFile, setPicFile] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePicChange = (e) => {
    setPicFile(e.target.files[0])
  }

  const handleSave = async () => {
    let updatedUser = { ...form }
    if (picFile) {
      const formData = new FormData()
      formData.append('profilePic', picFile)
      formData.append('email', user.email)
      const res = await axios.post('http://localhost:5000/api/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updatedUser = res.data.user
    }
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    setEdit(false)
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18122B] text-white">
      <div className="bg-[#282142] p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <img
           src={user.profilePic ? `https://MyChatApp.up.railway.app${encodeURI(user.profilePic)}` : assets.avatar_icon}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-violet-500"
          />
          {edit ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                className="mb-2"
              />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="bg-[#18122B] p-2 rounded w-full mb-2"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#18122B] p-2 rounded w-full mb-2"
                placeholder="Email"
                disabled
              />
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="bg-[#18122B] p-2 rounded w-full mb-2"
                placeholder="Bio"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-semibold"
                >
                  Return to Main
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-sm text-gray-300">{user.email}</p>
              <p className="text-center text-gray-400">{user.bio}</p>
              <button
                onClick={() => setEdit(true)}
                className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white font-semibold mt-2"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage