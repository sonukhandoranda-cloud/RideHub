const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistToken = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
      const isBlacklisted = await BlacklistToken.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({ error: 'Token has been blacklisted.' });
      }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({ error: 'Invalid token.' });
    }
}