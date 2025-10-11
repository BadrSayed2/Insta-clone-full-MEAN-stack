const Joi = require("joi");

const rules = {
  userName: Joi.string().min(4).max(12).lowercase().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 4 characters",
    "string.max": "Username must not exceed 12 characters",
  }),

  fullName: Joi.string().min(4).max(20).messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 4 characters",
    "string.max": "Full name must not exceed 20 characters",
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net", "edu"] },
    })
    .lowercase()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 30 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    }),

  phoneNumber: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/) 
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base":
        "Phone number must be a valid Egyptian number (e.g. 010xxxxxxxx)",
    }),

  gender: Joi.string().valid("male", "female").messages({
    "any.only": "Gender must be either male or female",
    "string.empty": "Gender is required",
  }),

  bio: Joi.string().max(200).allow("", null).messages({
    "string.max": "Bio must not exceed 200 characters",
  }),

  DOB: Joi.date().less("now").iso().messages({
    "date.base": "Date of birth must be a valid date",
    "date.less": "Date of birth must be in the past",
    "any.required": "Date of birth is required",
  }),

  otpCode: Joi.string()
    .length(8)
    .pattern(/^\d+$/)
    .messages({
      "string.empty": "OTP code is required",
      "string.length": "OTP code must be exactly 8 digits",
      "string.pattern.base": "OTP code must contain only numbers",
    }),
};

const signupSchema = Joi.object({
  userName: rules.userName.required(),
  fullName: rules.fullName.required(),
  email: rules.email.required(),
  password: rules.password.required(),
  confirmationPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .strip()
    .messages({
      "any.only": "Confirmation password must match password",
      "string.empty": "Confirmation password is required",
    }),
  phoneNumber: rules.phoneNumber.required(),
  gender: rules.gender.required(),
  bio: rules.bio, 
  DOB: rules.DOB.required(),
}).prefs({ abortEarly: false });

const loginSchema = Joi.object({
  email: rules.email.required(),
  password: rules.password.required(),
}).prefs({ abortEarly: false });

const forgetPasswordSchema = Joi.object({
  email: rules.email.required(),
});

const resetPasswordSchema = Joi.object({
  newPassword: rules.password.required().label("New password"),
  confirmationPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .strip()
    .messages({
      "any.only": "Confirmation password must match new password",
      "string.empty": "Confirmation password is required",
    }),
}).prefs({ abortEarly: false });

const verifyOtpSchema = Joi.object({
  code: rules.otpCode.required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
};
