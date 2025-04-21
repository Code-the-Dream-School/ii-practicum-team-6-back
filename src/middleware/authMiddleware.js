const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthenticatedError = require('../errors/unauthenticated')

exports.authenticate = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            throw new UnauthenticatedError('Not Authorized')
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
    
            const currentTime = Math.floor(Date.now() / 1000); 
            
            if (decoded.exp < currentTime) {
                return res.status(401).json({ message: 'Token expired' });
            }
            req.user = decoded.user; 
            next();
        })
    }
    
    catch (error) {
        next(error)
    }
}