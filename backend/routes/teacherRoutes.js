const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const upload = require('../config/fileUpload'); // Adjust path as needed

// Create a new teacher (with file upload)
router.post('/', upload.single('pic'), teacherController.createTeacher);

// Get all teachers
router.get('/', teacherController.getAllTeachers);

// Get a single teacher by ID
router.get('/:id', teacherController.getTeacherById);

// Update teacher by ID (with file upload)
router.put('/:id', upload.single('pic'), teacherController.updateTeacher);

// Delete teacher by ID
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
