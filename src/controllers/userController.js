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
const userService = require('../services/userServices')
const { toUsersResponseDto, toUserResponseDto } = require('../dtos/user.dto')

exports.getAllUsers = async (req, res, next) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const {users, total} = await userService.getAllUsers(page, limit)
        res.status(200).json({
            success: true,
            message: 'Users Fetched Successfully',
            data: {
                users: toUsersResponseDto(users),
                totalUsers: total,
                limit : limit,
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

