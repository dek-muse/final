const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: Number,
    required: true,
    unique: true
  },
  teacherType: {
    type: String,
    enum: ['Kg', 'Primary', 'Secondary', 'Preparatory', 'University/Colleges']
  },
  educationLevel: { 
    type: String, 
    required: true 
  },
  salary: Number,
  birthDate: Date,
  address: String,
  region: String,
  district: String,
  qualifications: String,
  experience: String,
  subjectsLearned: [String],
  subjectsTech: [String],
  description: String,
  joiningDate: Date,
  picture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  fileAttachment: { 
    type: String, 
    default: null 
  },
  sex: [String],
  nativeStatus: [String],

  // Kani waa meesha aan ku darayno `createdBy`
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tani waxa ay tixraaceysaa sharciga `User`
    required: true // Waa in la buuxiyaa mar walba
  }

}, {
  timestamps: true // Waxay si toos ah u abuureysaa taariikhaha la abuuray (createdAt) iyo la cusbooneysiiyay (updatedAt)
});

module.exports = mongoose.model('Teacher', teacherSchema);
