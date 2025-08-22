const jwt = require("jsonwebtoken");
const { EventEmitter } = require("events");
const { emailTemplate } = require("./templates/EmailTemplate.js");
const { sendEmail } = require("./nodemailer.utils.js");
const logger = require("./logger");

const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email } = {}) => {
  try {
    const secret =
      process.env.SECRET_KEY_ACTIVE || process.env.SCRIT_KEY_ACTIVE;
    const tokenActive = jwt.sign({ email }, secret, {
      expiresIn: "1h",
    });

    const apiBase = process.env.API_BASE_URL || "http://localhost:4000";
    // Direct verification API link (GET)
    const verifyUrl = `${apiBase}/auth/verify?token=${tokenActive}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: emailTemplate({
        link: verifyUrl,
        title: "Verify Your Email",
        message:
          "Welcome to Insta Arab! Please click the button below to verify your email address and activate your account.",
        securityNote:
          "This link will expire in 1 hour. If you didn't create this account, please ignore this email.",
        ctaText: "Verify Email",
      }),
    });
  } catch (err) {
    logger.error(`Email Event Error: ${err.message}`);
  }
});
emailEvent.on("sendResetPasswordEmail", async ({ email, resetUrl } = {}) => {
  try {
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: emailTemplate({
        link: resetUrl,
        title: "Reset Your Password",
        message:
          "We received a request to reset your password. Click the button below to set a new password.",
        securityNote:
          "If you didn’t request this, you can safely ignore this email.",
        ctaText: "Reset Password",
      }),
    });
  } catch (err) {
    logger.error(`Email Event Error: ${err.message}`);
  }
});

module.exports = { emailEvent };
