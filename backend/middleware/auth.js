const jwt = require('jsonwebtoken');
// const User = require('../models/user.model');

// Middleware to authenticate user
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = user; // Set the authenticated user
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};
