const User = require('../models/user.Model.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role || username.trim() === '' || email.trim() === '' || password.trim() === '' || role.trim() === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role, // include role
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', _id: newUser._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error });
  }
};


// Signin (Login)
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === '' || password.trim() === '') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    const { password: pass, ...rest } = user._doc;

    res.status(200).cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
    }).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error Networking ', error });
  }
};

// Read (Get user by ID)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update (Update user by ID)
const updateUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username ? username.trim() : user.username;
    user.email = email ? email.trim() : user.email;
    user.role = role ? role.trim() : user.role; // Update role if provided

    if (password && password.trim() !== '') {
      user.password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await user.save();
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete (Delete user by ID)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const usersWithoutPasswords = users.map(user => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

module.exports = {
  signup,
  signin,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
