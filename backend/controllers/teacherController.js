const Teacher = require('../models/Teacher');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Handle file uploads for profile picture and attachment
const upload = multer({ storage: storage }).fields([
  { name: 'picture', maxCount: 1 },
  { name: 'fileAttachment', maxCount: 1 }
]);

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const teacherData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      city: req.body.city,
      region: req.body.region,
      district: req.body.district,
      qualifications: req.body.qualifications,
      teacherType: req.body.teacherType,
      experience: req.body.experience,
      subjectsLearned: req.body.subjectsLearned,
      subjectsTech: req.body.subjectsTech,
      description: req.body.description,
      joiningDate: req.body.joiningDate,
      sex: req.body.sex,
      nativeStatus: req.body.nativeStatus,
      picture: req.files['picture'] ? req.files['picture'][0].path : null,
      fileAttachment: req.files['fileAttachment'] ? req.files['fileAttachment'][0].path : null,
      birthDate: req.body.birthDate,
      educationLevel: req.body.educationLevel,
      salary: req.body.salary,
      createdBy: req.user._id // Set the ID of the user who created the teacher
    };

    const teacher = new Teacher(teacherData);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      res.status(400).json({ error: `${duplicateKey} must be unique` });
    } else {
      console.error('Error creating teacher:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('createdBy', 'name email'); // Populate createdBy with user info
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id).populate('createdBy', 'name email');
    if (teacher) {
      res.status(200).json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update teacher by ID
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByIdAndUpdate(id, req.body, { new: true });
    if (teacher) {
      res.status(200).json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete teacher by ID
exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (teacher) {
      res.status(200).json({ message: 'Teacher deleted successfully' });
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: error.message });
  }
};
