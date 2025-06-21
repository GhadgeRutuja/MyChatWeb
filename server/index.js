const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

// Import Mongoose models
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB Atlas
const MONGO_URI = 'mongodb+srv://Chatapp:Rutuja8304@rutuja.2jshv.mongodb.net/Chatapp?retryWrites=true&w=majority&appName=Chatapp';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, fullName, bio } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = new User({ email, password, fullName, bio, profilePic: null });
    await newUser.save();
    const userData = newUser.toObject();
    delete userData.password;
    res.json({ success: true, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      const userData = user.toObject();
      delete userData.password;
      res.json({ success: true, user: userData });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get all users (for sidebar/user list)
app.get('/api/users', async (req, res) => {
  try {
    const { email } = req.query;
    let users;
    if (email) {
      users = await User.find({ email: { $ne: email } });
    } else {
      users = await User.find();
    }
    const usersWithoutPasswords = users.map(u => {
      const obj = u.toObject();
      delete obj.password;
      return obj;
    });
    res.json(usersWithoutPasswords);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get messages between two users
app.get('/api/messages', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ success: false, message: 'user1 and user2 are required' });
    }
    const chat = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Send a message (supports media)
app.post('/api/messages', async (req, res) => {
  try {
    const { sender, receiver, text, mediaUrl } = req.body;
    if (!sender || !receiver || (!text && !mediaUrl)) {
      return res.status(400).json({ success: false, message: 'sender, receiver, and text or media required' });
    }
    const newMsg = new Message({
      sender,
      receiver,
      text,
      mediaUrl: mediaUrl || null,
      timestamp: Date.now()
    });
    await newMsg.save();
    res.json({ success: true, message: newMsg });
    io.emit('receive_message', newMsg);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Profile picture upload
app.post('/api/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user && req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
      await user.save();
      const userData = user.toObject();
      delete userData.password;
      res.json({ success: true, user: userData });
    } else {
      res.status(400).json({ success: false, message: 'Upload failed' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile pic upload failed' });
  }
});

// Chat media upload
app.post('/api/upload-chat-media', upload.single('media'), (req, res) => {
  if (req.file) {
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ success: false, message: 'Upload failed' });
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      const newMsg = new Message({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        mediaUrl: data.mediaUrl || null,
        timestamp: data.timestamp
      });
      await newMsg.save();
      socket.broadcast.emit('receive_message', newMsg);
    } catch (err) {
      console.error('Socket message save error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('✅ Server is running on port 5000');
});