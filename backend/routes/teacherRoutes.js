const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authMiddleware } = require('../middleware/auth');

// Add the routes for teacher operations
router.post('/', authMiddleware, teacherController.createTeacher);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.put('/:id', authMiddleware, teacherController.updateTeacher);
router.delete('/:id', authMiddleware, teacherController.deleteTeacher);

module.exports = router;
