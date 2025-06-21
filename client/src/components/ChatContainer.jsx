import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import assets from '../assets/assets'

const socket = io('https://mychatweb-production.up.railway.app')

const ChatContainer = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  // Fetch messages from backend when a user is selected
  useEffect(() => {
    if (selectedUser && currentUser) {
      axios
        .get(`https://mychatweb-production.up.railway.app/api/messages?user1=${currentUser.email}&user2=${selectedUser.email}`)
        .then(res => setMessages(res.data))
        .catch(() => setMessages([]))
    } else {
      setMessages([])
    }
  }, [selectedUser, currentUser])

  // Real-time receive
  useEffect(() => {
    socket.on('receive_message', (msg) => {
      if (
        selectedUser &&
        ((msg.sender === currentUser.email && msg.receiver === selectedUser.email) ||
          (msg.sender === selectedUser.email && msg.receiver === currentUser.email))
      ) {
        setMessages(prev => [...prev, msg])
      }
    })
    return () => socket.off('receive_message')
  }, [selectedUser, currentUser])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !currentUser || !selectedUser) return
    try {
      const res = await axios.post('https://mychatweb-production.up.railway.app/api/messages', {
        sender: currentUser.email,
        receiver: selectedUser.email,
        text: input
      })
      setMessages([...messages, res.data.message])
      socket.emit('send_message', {
        sender: currentUser.email,
        receiver: selectedUser.email,
        text: input,
        timestamp: Date.now()
      })
      setInput('')
    } catch (err) {
      // Optionally handle error
    }
  }

  // Handle media (image/video) send
  const handleMediaSend = async (e) => {
    const file = e.target.files[0]
    if (!file || !currentUser || !selectedUser) return
    const formData = new FormData()
    formData.append('media', file)
    const res = await axios.post('https://mychatweb-production.up.railway.app/api/upload-chat-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success) {
      const msgRes = await axios.post('https://mychatweb-production.up.railway.app/api/messages', {
        sender: currentUser.email,
        receiver: selectedUser.email,
        text: '',
        mediaUrl: res.data.url
      })
      setMessages([...messages, msgRes.data.message])
      socket.emit('send_message', {
        sender: currentUser.email,
        receiver: selectedUser.email,
        text: '',
        mediaUrl: res.data.url,
        timestamp: Date.now()
      })
    }
  }

  if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center h-full text-gray-400 text-lg bg-[#18122B]">
        <span>Chats will appear here…</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#18122B]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#282142]">
        <img
          src={selectedUser.profilePic ? `https://mychatweb-production.up.railway.app${encodeURI(selectedUser.profilePic)}` : assets.avatar_icon}
          alt={selectedUser.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-white">{selectedUser.fullName}</div>
          <div className="text-xs text-green-400">Online</div>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id || msg._id}
            className={`flex ${msg.sender === currentUser.email ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender !== currentUser.email && (
              <img
                src={selectedUser.profilePic ? `https://mychatweb-production.up.railway.app${encodeURI(selectedUser.profilePic)}` : assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full mr-2 self-end"
              />
            )}
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow
                ${msg.sender === currentUser.email
                  ? 'bg-violet-600 text-white rounded-br-none'
                  : 'bg-[#282142] text-gray-200 rounded-bl-none'
                }`}
            >
              {msg.text}
              {/* Show media if present */}
              {msg.mediaUrl && (
                msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={`https://mychatweb-production.up.railway.app${msg.mediaUrl}`} controls className="max-w-[200px] rounded mt-2" />
                ) : (
                  <img src={`https://mychatweb-production.up.railway.app${msg.mediaUrl}`} alt="media" className="max-w-[200px] rounded mt-2" />
                )
              )}
              <div className="text-[10px] text-right text-gray-300 mt-1">
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </div>
            </div>
            {msg.sender === currentUser.email && (
              <img
                src={currentUser.profilePic ? `https://mychatweb-production.up.railway.app${encodeURI(currentUser.profilePic)}` : assets.avatar_icon}
                alt=""
                className="w-7 h-7 rounded-full ml-2 self-end"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-4 border-t border-[#282142] bg-[#18122B]"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-[#282142] text-white rounded-full px-4 py-2 outline-none"
        />
        {/* Custom file upload button */}
        <label className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-full font-semibold flex items-center">
          📎
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaSend}
            className="hidden"
          />
        </label>
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  )
}
export default ChatContainer