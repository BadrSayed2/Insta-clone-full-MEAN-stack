const jwt = require("jsonwebtoken");
const { EventEmitter } = require("events");
const { confirmEmailTemplate } = require("./confirmEmailTemplate.js");
const { sendEmail } = require("./nodemailer.utils.js");
const logger = require("./logger");

const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email } = {}) => {
  try {
    const tokenActive = jwt.sign({ email }, process.env.SECRET_KEY_ACTIVE, {
      expiresIn: "1h",
    });

    const apiBase = process.env.API_BASE_URL || "http://localhost:4000";
    // Direct verification API link (GET)
    const verifyUrl = `${apiBase}/auth/verify?token=${tokenActive}`;

    await sendEmail({
      to: email,
      subject: "hello",
      html: confirmEmailTemplate({ link: verifyUrl }),
    });
  } catch (err) {
    logger.error(`Email Event Error: ${err.message}`);
  }
});

module.exports = { emailEvent };
