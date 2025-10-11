const Joi = require("joi");

module.exports = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    const { error, value } = schema.validate(data, {
      abortEarly: false, 
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    req[property] = value;
    next();
  };
};
