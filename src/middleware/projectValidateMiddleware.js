module.exports = (schema) => {
    return (req, res, next) => {
      console.log('schema',schema);
      
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }
      req.body = value; 
      next();
    };
  };