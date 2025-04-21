const BadRequestError = require('../errors/bad-request')
const authService = require('../services/authServices')
const { toUserResponseDto } = require('../dtos/user.dto')


exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.signUp(username, email, password);
        res.status(201).json({
            message: 'User Created Succesfully',
            user: toUserResponseDto(user)
        })
    }
    catch (err) {
        next(err);
    }
}


exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.signIn(email, password);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        });
        res.status(200).json({
            message: 'Authentication Succesfull',
            user: toUserResponseDto(user)
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
            message: 'Users Loged out Succesfully',
        });
    }
    catch (err) {
        next(err);
    }
};

exports.authMe = (req, res, next) => {
    console.log("auth")
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not Authorized" });
        }
        const user = req.user;
        console.log(req.user)
        res.status(200).json({
            message: 'Authentication Succesfull',
            user: toUserResponseDto(user)
        });
    }
    catch (err) {
        next(err);
    }
};

exports.forgotPassword = async (req, res, next) => {

    try {
        const email = req.user.email;
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


