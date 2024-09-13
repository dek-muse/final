const express = require('express');
const {
  signup,
  signin,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/userController.js');

const router = express.Router();

// Routes for user management
router.post('/signup', signup);
router.post('/login', signin);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
