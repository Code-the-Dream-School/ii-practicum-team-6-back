const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthenticatedError = require('../errors/unauthenticated')
const User = require('../models/user')

exports.authenticate = async (req, res, next) => {

    try {
        const token = req.cookies.token;
        if (!token) {
            throw new UnauthenticatedError('Not Authorized')
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).populate('skills', 'name');
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        req.user = user;
        next();
   
    }
    
    catch (error) {
        next(error)
    }
}