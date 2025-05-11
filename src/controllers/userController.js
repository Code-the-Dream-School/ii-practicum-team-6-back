require('dotenv').config();
const userService = require('../services/userServices')
const { toUsersResponseDto, toUserResponseDto } = require('../dtos/user.dto');
const { toProjectResponseDto, toProjectsResponseDto } = require('../dtos/project.dto');
const BadRequestError = require('../errors/bad-request')


exports.getAllUsers = async (req, res, next) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { users, total } = await userService.getAllUsers(page, limit)
        res.status(200).json({
            success: true,
            message: 'Users Fetched Successfully',
            data: {
                users: toUsersResponseDto(users),
                totalUsers: total,
                limit: limit,
                page: page,
            }
        })
    }
    catch (err) {
        next(err)
    }
}


exports.getUserById = async (req, res, next) => {

    try {
        const userId = req.params.id
        const user = await userService.getUserById(userId)

        res.status(200).json({
            success: true,
            message: 'User Fetched Successfully',
            data: { user: toUserResponseDto(user) }
        })
    }
    catch (err) {
        next(err)
    }

}


exports.updateMyProfile = async (req, res, next) => {

    try {
        const userId = req.user.id
        const { username, bio, skills } = req.body
        const user = await userService.updateMyProfile(userId, username, bio, skills)

        res.status(200).json({
            success: true,
            message: 'User Updated Successfully',
            data: { user: toUserResponseDto(user) }
        })
    }
    catch (err) {
        next(err)
    }
}

exports.deleteMyProfile = async (req, res, next) => {

    try {
        const userId = req.user.id

        await userService.deleteMyProfile(userId)

        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
        })
    }
    catch (err) {
        next(err)
    }
}


exports.uploadAvatar = async (req, res, next) => {

    try {

        if (!req.file?.path) {
            throw new BadRequestError('Avatar not Uploaded')
        }

        const uploadResult = await userService.uploadAvatar(req.file.path, req.user.id)

        res.status(200).json({
            success: true,
            message: 'File Uploaded Successfully',
            data: { avatarUrl: uploadResult.url }
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteAvatar = async (req, res, next) => {

    try {

        await userService.deleteAvatar(req.user.id)

        res.status(200).json({
            success: true,
            message: 'Avatar deleted Successfully',
        })
    } catch (error) {
        next(error)
    }
}

exports.myProjects = async (req, res, next) => {
    
    try {
        const projects = await userService.myProjects(req.user.id)

        res.status(200).json({
            success: true,
            message: 'My Projects fetched successfully',
            data: { projects: toProjectsResponseDto(projects) }
        })
    } catch (error) {
        next(error)
    }
}

exports.myProjectRequests = async (req, res, next) => {
    
    try {
        const { status } = req.query;
        const projectRequests = await userService.myProjectsRequests(req.user.id, status)
        
        res.status(200).json({
            success: true,
            message: 'My Project Requests fetched successfully',
            data: { projects: projectRequests }
        })
    } catch (error) {
        next(error)
    }
}

