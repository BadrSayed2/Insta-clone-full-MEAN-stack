const Joi = require("joi");

const rules = {
  postId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) 
    .messages({
      "string.empty": "Post ID is required",
      "string.pattern.base": "Post ID must be a valid Mongo ObjectId",
    }),

  caption: Joi.string().max(500).allow("", null).messages({
    "string.max": "Caption must not exceed 500 characters",
  }),

  visibility: Joi.string().valid("public", "private").messages({
    "any.only": "Visibility must be either public or private",
  }),
};


const createPostSchema = Joi.object({
  caption: rules.caption,
  visibility: rules.visibility.required(),
}).prefs({ abortEarly: false });


const updatePostSchema = Joi.object({
  postId: rules.postId.required(),
  caption: rules.caption,
  visibility: rules.visibility,
}).prefs({ abortEarly: false });

const getPostSchema = Joi.object({
  postId: rules.postId.required(),
}).prefs({ abortEarly: false });


const deletePostSchema = Joi.object({
  postId: rules.postId.required(),
}).prefs({ abortEarly: false });

module.exports = {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
  deletePostSchema,
};
