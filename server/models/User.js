const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  fullName: String,
  bio: String,
  profilePic: String
});

module.exports = mongoose.model('User', UserSchema);