// controllers/teacherController.js
const Teacher = require('../models/Teacher'); // Adjust the path as necessary
const User = require('../models/user.Model'); // Assuming you have a User model

// Custom error handler
const handleError = (res, error, defaultMessage = 'An error occurred') => {
    const message = error?.message || defaultMessage;
    const statusCode = error?.statusCode || 500; // Default to 500 if not specified
    return res.status(statusCode).json({ message });
};

// CREATE a new teacher
exports.createTeacher = async (req, res) => {
    try {
        const { createdBy, ...teacherData } = req.body;

        // Ensure the creator (user) exists in the system
        const user = await User.findById(createdBy);
        if (!user) {
            return handleError(res, { statusCode: 404, message: 'User not found' });
        }

        // Check if the user is an Admin or SuperAdmin
        if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
            return handleError(res, { statusCode: 403, message: 'Only Admins and SuperAdmins can create a teacher.' });
        }

        const teacher = new Teacher({
            ...teacherData,
            createdBy,
        });

        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        handleError(res, error);
    }
};

// READ all teachers
exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('createdBy updatedBy');
        res.status(200).json(teachers);
    } catch (error) {
        handleError(res, error);
    }
};

// READ a single teacher by ID
exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('createdBy updatedBy');
        if (!teacher) {
            return handleError(res, { statusCode: 404, message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        handleError(res, error);
    }
};

// UPDATE a teacher by ID
exports.updateTeacher = async (req, res) => {
    try {
        const { updatedBy, ...teacherData } = req.body;

        // Check if the user performing the update exists
        const user = await User.findById(updatedBy);
        if (!user) {
            return handleError(res, { statusCode: 404, message: 'User not found' });
        }

        // Check if the user is an Admin or SuperAdmin
        if (user.role !== 'Admin' && user.role !== 'SuperAdmin') {
            return handleError(res, { statusCode: 403, message: 'Only Admins and SuperAdmins can update a teacher.' });
        }

        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            {
                ...teacherData,
                updatedBy,
            },
            { new: true, runValidators: true }
        );

        if (!teacher) {
            return handleError(res, { statusCode: 404, message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE a teacher by ID
exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return handleError(res, { statusCode: 404, message: 'Teacher not found' });
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};