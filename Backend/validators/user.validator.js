const Joi = require("joi");



const rules = {
  userName: Joi.string().alphanum().min(4).max(20).messages({
    "string.base": "Username must be a string",
    "string.alphanum": "Username can only contain letters and numbers",
    "string.min": "Username must be at least 4 characters",
    "string.max": "Username must not exceed 20 characters",
  }),

  fullName: Joi.string().min(4).max(50).messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 4 characters",
    "string.max": "Full name must not exceed 50 characters",
  }),

  bio: Joi.string().max(200).allow("", null).messages({
    "string.max": "Bio must not exceed 200 characters",
  }),

  gender: Joi.string().valid("male", "female").messages({
    "any.only": "Gender must be either male or female",
  }),

  accessability: Joi.string().valid("public", "private").messages({
    "any.only": "Accessibility must be either public or private",
  }),

  phoneNumber: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Egyptian number (e.g. 010xxxxxxxx)",
    }),

  usernameParam: Joi.string().alphanum().min(4).max(20).required().messages({
    "any.required": "Username param is required",
  }),
};

const getOtherUserProfileSchema = Joi.object({
  username: rules.usernameParam,
});

const updateProfileSchema = Joi.object({
  userName: rules.userName,
  fullName: rules.fullName,
  bio: rules.bio,
  gender: rules.gender,
  accessability: rules.accessability,
  phoneNumber: rules.phoneNumber,
}).min(1) 
  .messages({
    "object.min": "You must provide at least one field to update",
  });

const getUsersSchema = Joi.object({
  search: Joi.string().max(50).allow("", null),
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1),
  sort: Joi.string().valid("asc", "desc", "-createdAt", "createdAt").default("-createdAt"),
}).unknown(true); 


module.exports = {
  getOtherUserProfileSchema,
  updateProfileSchema,
  getUsersSchema,
};
