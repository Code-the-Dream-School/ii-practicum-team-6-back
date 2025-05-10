module.exports = (schema) => {
    return (req, res, next) => {
           
      const { error, value } = schema.validate(req.body);
      if (error) {
        const cleanMessage = error.details[0].message.replace(/["']/g, '');
        return res.status(400).json({ 
          success: false,
          message: cleanMessage
        });
      }
      req.body = value; 
      next();
    };
  };