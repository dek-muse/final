const User = require('../models/user.Model.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign Up
const signup = async (req, res) => {
  const { FullName, email, password, role, region } = req.body;

  // Validate required fields
  if (!FullName || !email || !password || !role || !region) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      FullName: FullName.trim(),
      email: email.trim(),
      password: hashedPassword,
      role: role.trim(),
      region: region.trim(),
    });

    // Save user to database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', _id: newUser._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or UserName already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Sign In (Login)
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Exclude password from the response
    const { password: _, ...rest } = user._doc;

    res.status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Get User by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude password from the response
    const { password: _, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update User by ID
const updateUser = async (req, res) => {
  const { FullName, email, password, role, region } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    user.FullName = FullName ? FullName.trim() : user.FullName;
    user.email = email ? email.trim() : user.email;
    user.role = role ? role.trim() : user.role;
    user.region = region ? region.trim() : user.region;

    // Hash the new password if provided
    if (password && password.trim() !== '') {
      user.password = await bcryptjs.hash(password, 10);
    }

    const updatedUser = await user.save();
    const { password: _, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email or FullName already exists' });
    }
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete User by ID
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
      const { password: _, ...rest } = user._doc;
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
