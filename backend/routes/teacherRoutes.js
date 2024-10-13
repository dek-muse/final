const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); // Adjust the path as necessary

// CREATE a teacher
router.post('', teacherController.createTeacher);

// READ all teachers
router.get('/', teacherController.getTeachers);

// READ a single teacher by ID
router.get('/:id', teacherController.getTeacherById);

// UPDATE a teacher by ID
router.put('/:id', teacherController.updateTeacher);

// DELETE a teacher by ID
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;