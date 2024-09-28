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
  teacherType:{
    type: String, 
    enum:['Kg', 'secondary', 'primary', 'elementary']
  },
  address: String,
  city: String,
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
  sex: [String],
  nativeStatus: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);