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
        console.log(decoded.user.id)
        const user = await User.findById(decoded.user.id).populate('skills', 'name');
        console.log(user)
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        req.user = user;
        next();
    // try{
      
        
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //         if (err) {
    //             return res.status(401).json({ message: 'Invalid token' });
    //         }
            
    //         const currentTime = Math.floor(Date.now() / 1000); 
    //         const user =  User.findById(decoded.id);
    //         if (decoded.exp < currentTime) {
    //             return res.status(401).json({ message: 'Token expired' });
    //         }
    //         req.user = user; 
    //         next();
    //     })
    }
    
    catch (error) {
        next(error)
    }
}