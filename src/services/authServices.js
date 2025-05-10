const User = require('../models/user')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const { toUserResponseDto } = require('../dtos/user.dto')

exports.signUp = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 6);
    const existed = await User.findOne({ email }).populate('skills', 'name ');

    if (existed) {
        throw new BadRequestError('Account with this email already exists');
    }

   

    const user = new User({
        username: username,
        password: hashedPassword,
        email: email
    });

    const token = jwt.sign({ user: toUserResponseDto(user) }, process.env.JWT_SECRET,  { expiresIn: '1h' });

    await user.save();

    return {user, token};
}

exports.signIn = async (email, password, rememberMe) => {
    
    const user = await User.findOne({ email: email }).populate('skills', 'name ');

    if (!user) {
        throw new UnauthenticatedError('Authentication failed. User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const token = jwt.sign({ user: toUserResponseDto(user) }, process.env.JWT_SECRET, rememberMe ? { expiresIn: '30d' } : { expiresIn: '1h' });
        return { token, user };
    }
    else {
        throw new UnauthenticatedError('Authentication failed. Wrong Password')
    }
}

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new NotFoundError('Email not found')
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetUrl = `${process.env.CLIENT_URL}/api/auth/reset-password/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions);
};

exports.resetPassword = async (token, newPassword) => {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        throw new NotFoundError('Invalid or expired token')
    }

    user.password = await bcrypt.hash(newPassword, 6);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save()
    return user
}






