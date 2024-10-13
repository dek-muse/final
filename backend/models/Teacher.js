  // models/Teacher.js
  const mongoose = require('mongoose');

  const teacherSchema = new mongoose.Schema({
      name: {
          type: String,
          required: true,
      },
      email: {
          type: String,
          required: true,
          unique: true,
      },
      mobile: {
          type: Number,
          required: true,
          unique: true,
      },
      teacherType: {
          type: String,
          enum: ['Kg', 'Secondary', 'Primary', 'Elementary'],
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
      educationLevel: String,
      salary: String,
      birthDate: Date,
      picture: {
          type: String,
       },
      fileAttachment: String,
      sex: [String],
      nativeStatus: [String],
      createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
      },
      updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
       },
  }, {
      timestamps: true,
  });

  module.exports = mongoose.model('Teacher', teacherSchema);