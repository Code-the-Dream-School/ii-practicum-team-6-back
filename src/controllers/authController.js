const BadRequestError = require('../errors/bad-request')
const authService = require('../services/authServices')
const { toUserResponseDto } = require('../dtos/user.dto')


exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const {token ,user} = await authService.signUp(username, email, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        res.status(201).json({
            success : true,
            message: 'User Created Successfully',
            data: {user : toUserResponseDto(user)}
        })
    }
    catch (err) {
        next(err);
    }
}


exports.signIn = async (req, res, next) => {
    try {
        const { email, password ,rememberMe } = req.body;
        const { token, user } = await authService.signIn(email, password, rememberMe);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        res.status(200).json({
            success : true,
            message: 'Authentication Successfull',
            data: {user : toUserResponseDto(user)}
        });
    }
    catch (err) {
        next(err);
    }
}

exports.signOut = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new BadRequestError('User already logged out');
        }
        res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(200).json({
            success : true,
            message: 'Users Loged out Successfully',
        });
    }
    catch (err) {
        next(err);
    }
};

exports.authMe = (req, res, next) => {
    
    try {
        const user = req.user;
        res.status(200).json({
            success : true,
            message: 'Authentication Successfull',
            data: {user : toUserResponseDto(user)}
        });
    }
    catch (err) {
        next(err);
    }
};

exports.forgotPassword = async (req, res, next) => {

    try {
        const email = req.body.email;
        await authService.forgotPassword(email);
        res.status(200).send('Check your email for instructions on resetting your password');
    }
    catch (err) {
        next(err);
    }

};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.status(200).send('Password updated successfully');
    }
    catch (err) {
        next(err);
    }
}


