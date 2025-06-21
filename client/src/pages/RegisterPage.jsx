import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import axios from 'axios'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', fullName: '', bio: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.fullName) {
      setError('Please fill all required fields.')
      return
    }
    try {
      const res = await axios.post('http://localhost:5000/api/register', form)
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError('User already exists')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#18122B]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#282142] p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center gap-4"
      >
        <img src={assets.logo} alt="Logo" className="w-20 mb-2" />
        <h2 className="text-2xl font-bold text-white mb-4">Register for MyChat</h2>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="bg-[#18122B] text-white p-2 rounded w-full outline-none"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-[#18122B] text-white p-2 rounded w-full outline-none"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="bg-[#18122B] text-white p-2 rounded w-full outline-none"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio"
          className="bg-[#18122B] text-white p-2 rounded w-full outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white font-semibold w-full mt-2"
        >
          Register
        </button>
        <p className="text-gray-400 text-xs mt-2">
          Already have an account?{' '}
          <span
            className="text-violet-400 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage