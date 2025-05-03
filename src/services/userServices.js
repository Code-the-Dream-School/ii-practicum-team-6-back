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

exports.getAllUsers = async (page, limit) => {

    const startIndex = (page - 1) * limit;

    const users = await User.find().populate('skills', 'name').skip(startIndex).limit(limit);
    const total = await User.countDocuments();

    const pages = Math.ceil(total / limit);

    if (page > pages) {
        throw new BadRequestError('Page not found');
    }
    if (!users || users.length < 1) {
        throw new BadRequestError('Error fetching Users')
    }

    return { users, total }
}

exports.getUserById = async (userId) => {

    const user = await User.findById(userId).populate('skills', 'name');

    if (!user) {
        throw new BadRequestError('Error fetching User');
    };

    return user;
}


exports.updateMyProfile = async (userId, username, bio, skills) => {

    const currentUser = await User.findById(userId).populate('skills', 'name')

    if (!currentUser) {
        throw new NotFoundError('User not found')
    }

    const updatedFields = {};

    if (currentUser.username !== username) updatedFields.username = username;
    if (currentUser.bio !== bio) updatedFields.bio = bio;
    if (JSON.stringify(currentUser.skills) !== JSON.stringify(skills)) updatedFields.skills = skills;

    const validSkills = await Skill.find({ name: { $in: updatedFields.skills } }).distinct('_id');
    const skillIds = validSkills.map(skill => skill.toString());

    const user = await User.findOneAndUpdate({ _id: userId }, { ...updatedFields, skills: skillIds }, { new: true }).populate('skills')
    if (!user) {
        throw new NotFoundError('User Not Found ')
    }
    return user;
}



exports.deleteMyProfile = async (userId) => {

    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
        throw new NotFoundError('User not found')
    }
}

