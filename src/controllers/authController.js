const User = require('../models/user')
const Skill = require('../models/skill')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/unauthenticated')
const NotFoundError = require('../errors/not-found')
const userIdSchema = require('../validators/userIdValidator')
const resetPasswordSchema = require('../validators/resetPasswordValidator')


exports.signUp = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: "error",
            message: "Passwords doesn't match"
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 6)
        const existed = await User.findOne({ email })
        if (existed) {
            throw new BadRequestError('Account with this email already exists')
        }
        const user = new User({
            username: username,
            password: hashedPassword,
            email: email
        })
        await user.save()
        res.status(201).json({
            message: 'User Created Succesfully',
            user: user
        })
    }
    catch (err) {
        next(err)
    }
}


exports.signIn = async (req, res, next) => {

    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new UnauthenticatedError('Authentication failed. User not found')
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None'
            });

            res.status(200).json({
                message: 'Authentication succesfull',
                user: user,
            })
        }
        else {
            throw new UnauthenticatedError('Authentication failed. Wrong Password')
        }
    }
    catch (err) {
        next(err)
    }
}

exports.signOut = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new BadRequestError('User already logged out')
        }
        res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({
            message: 'Users Loged out Succesfully',
        })
    }
    catch (err) {
        next(err)
    }

};

exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find()
        if (!users) {
            throw new BadRequestError('Error fetching Users')
        }
        res.status(200).json({
            message: 'Users Fetched Succesfully',
            users: users
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Error fetching Users',
            error: err
        })
    }
}

exports.getUserById = async (req, res, next) => {

    try {
        const userId = req.params.id
        const { error } = userIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await User.findById(userId)
        if (!user) {
            throw new BadRequestError('Error fetching User')
        }
        res.status(200).json({
            message: 'Users Fetched Successfully',
            user: user
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'Error fetching Users',
            error: err.message || 'Internal Server Error'
        })
    }
}


exports.updateMyProfile = async (req, res, next) => {

    try {
        const userId = req.user.id
        const { username, bio, skills } = req.body
        const currentUser = await User.findById(userId)

        if (!currentUser) {
            throw new (NotFoundError('User not found'))
        }

        const updatedFields = {};

        if (currentUser.username !== username) updatedFields.username = username;
        if (currentUser.bio !== bio) updatedFields.bio = bio;
        if (JSON.stringify(currentUser.skills) !== JSON.stringify(skills)) updatedFields.skills = skills;

        const validSkills = await Skill.find({ name: { $in: updatedFields.skills } }).distinct('_id');
        const skillIds = validSkills.map(skill => skill.toString());

        const user = await User.findOneAndUpdate({ _id: userId }, { ...updatedFields, skills: skillIds }, { new: true }).populate('skills')
        if (!user) {
            throw new (NotFoundError('User Not Found '))
        }
        else {
            res.status(200).json({
                message: 'User Updated Succesfully',
                user: user
            })
        }
    }
    catch (err) {
        next(err)
    }
}

exports.deleteMyUser = async (req, res, next) => {

    try {
        const userId = req.user.id
        const { error } = userIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) {
            throw new NotFoundError('User not found')
        }
        else {
            res.clearCookie('token');
            res.status(200).json({
                message: 'User Deleted Succesfully',
            })
        }
    }
    catch (err) {
        next(err)
    }
}

exports.authMe = (req, res, next) => {
    console.log("auth")
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not Authorized" });
        }
        const { iat, exp, ...user } = req.user
        res.json(user);
    }
    catch (err) {
        res.status(500).json({
            message: 'Auth Error',
            error: err
        })
    }
};

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email })
        if (user) {
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
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset',
                text: `Click the following link to reset your password: http://localhost:3000/auth/reset-password/${token}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log(`Email sent: ${info.response}`);
                    res.status(200).send('Check your email for instructions on resetting your password');
                }
            });
        }
        else {
            res.status(404).send('Email not found');
        }
    }
    catch (err) {
        next(err)
    }

};


exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        const { error } = resetPasswordSchema.validate({newPassword,confirmPassword});
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (user) {
            user.password = await bcrypt.hash(newPassword, 6);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save()
            res.status(200).send('Password updated successfully');
          } else {
            res.status(404).send('Invalid or expired token');
          }
    }
    catch (err) {
        next(err)
    }
}


