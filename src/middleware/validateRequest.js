
exports.validateRequest = (schema, type = 'body') => {
    return (req, res, next) => {
        const data = req[type];
        const { error } = schema.validate(data) 
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    }
}