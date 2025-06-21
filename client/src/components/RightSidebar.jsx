import React, { useEffect, useState } from 'react'
import axios from 'axios'
import assets from '../assets/assets'

const RightSidebar = ({ selectedUser, currentUser }) => {
  const [mediaMessages, setMediaMessages] = useState([])

  useEffect(() => {
    if (selectedUser && currentUser) {
      axios
        .get(`http://localhost:5000/api/messages?user1=${currentUser.email}&user2=${selectedUser.email}`)
        .then(res => {
          console.log('Fetched messages:', res.data); // <-- Add this line
          setMediaMessages(res.data.filter(msg => msg.mediaUrl))
        })
    }
  }, [selectedUser, currentUser])

  if (!selectedUser) return null

  return (
    <div className="h-full bg-[#18122B] p-4 flex flex-col items-center border-l border-[#282142] min-w-[220px]">
      <img
  src={selectedUser.profilePic ? `http://localhost:5000${encodeURI(selectedUser.profilePic)}` : assets.avatar_icon}
  alt={selectedUser.fullName}
  className="w-20 h-20 rounded-full object-cover border-4 border-violet-500 mb-2"
/>
      <div className="text-lg font-semibold text-white">{selectedUser.fullName}</div>
      <div className="text-xs text-gray-400 mb-4 text-center">{selectedUser.bio}</div>
      <div className="w-full border-b border-[#282142] my-2" />
      <div className="w-full">
        <div className="text-sm text-gray-300 mb-2 font-semibold">Media</div>
        <div className="flex flex-wrap gap-2">
          {mediaMessages.length === 0 && (
            <div className="text-gray-500 text-xs">No media yet.</div>
          )}
          {mediaMessages.map((msg, idx) =>
            msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                key={idx}
                src={`http://localhost:5000${msg.mediaUrl}`}
                controls
                className="w-16 h-16 rounded object-cover border border-[#282142]"
              />
            ) : (
              <img
                key={idx}
                src={`http://localhost:5000${msg.mediaUrl}`}
                alt="Chat Media"
                className="w-16 h-16 rounded object-cover border border-[#282142]"
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default RightSidebar