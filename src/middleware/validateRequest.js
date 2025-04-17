
exports.validateRequest = (schema) => {
    return (req, res, next) => {
        console.log(req.body)
        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    }
}