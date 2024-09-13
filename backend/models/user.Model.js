const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  role: {
    type: String,
    enum: ['Admin', 'SuperAdmin', 'User'],
    default: 'User'
  },
  region: {
    type: String,
    enum: ['Afdheer', 'Daawo', 'Doolo', 'Erar', 'Faafan', 'Jarar', 'Liibaan', 'Nogob', 'Qoraxay', 'Shabelle', 'Sitti'], // Added regions as an enum
    required: false, // Ensure region is required
  }, 
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
