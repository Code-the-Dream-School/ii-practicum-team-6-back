const User = require('../models/user')
const Skill = require('../models/skill')
const Project = require('../models/project')
require('dotenv').config();
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const { cloudinary } = require('../utils/cloudinaryStorage');
const ProjectRequest = require('../models/projectRequest')



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

exports.uploadAvatar = async (file, userId) => {

    const user = await User.findById(userId)
    if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    const uploadResult = await cloudinary.uploader.upload(file, {
        folder: 'avatars',
        public_id: `avatar_${Date.now()}`,
    });
    user.avatar = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
    }
    await user.save();

    return uploadResult

}

exports.deleteAvatar = async (userId) => {

    const user = await User.findById(userId)
    if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
        user.avatar = {
            url: '',
            public_id: ''
        }
        await user.save();
    }
    else {
        throw new BadRequestError('No avatar to delete')

    }
}

exports.myProjects = async (userId) => {

    const projects = await Project.find({ 'teamMembers.user': userId }).populate('reqSkills', 'name -_id')
    if (!projects || projects.length === 0) {
        throw new BadRequestError('No projects')
    }
    return projects
}

exports.myProjectsRequests = async (userId, status) => {

    const projectsRequests = await ProjectRequest.find({ userId: userId , status : status})
    if (!projectsRequests || projectsRequests.length === 0) {
        throw new BadRequestError('No project requests')
    }
    return projectsRequests
}

