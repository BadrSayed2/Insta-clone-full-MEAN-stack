const Joi = require("joi");

const rules = {
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/) // ObjectId صحيح
    .messages({
      "string.empty": "User ID is required",
      "string.pattern.base": "User ID must be a valid Mongo ObjectId",
    }),
};

const followSchema = Joi.object({
  userIdToFollow: rules.userId.required(),
}).prefs({ abortEarly: false });

const unfollowSchema = Joi.object({
  targetUserId: rules.userId.required(),
}).prefs({ abortEarly: false });

module.exports = {
  followSchema,
  unfollowSchema,
};
