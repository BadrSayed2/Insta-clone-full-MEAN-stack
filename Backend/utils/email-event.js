const jwt = require("jsonwebtoken");
const { EventEmitter } = require("events");
const { emailTemplate } = require("./templates/EmailTemplate.js");
const { sendEmail } = require("./nodemailer.utils.js");
const logger = require("./logger.js");
const { ResetEmailTemplate } = require("./templates/resetEmailTemplate.js");

const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email, code } = {}) => {
  try {
    // Direct verification API link (GET)
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: emailTemplate({
        title: "Verify Your Email",
        message: `Welcome to Insta Arab!<br><br> Please use the following code to verify your email: 
              <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #e91e63;">
                ${code}
              </div>`,
        securityNote: "This code will expire in 5 minutes.",
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
      html: ResetEmailTemplate({
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
