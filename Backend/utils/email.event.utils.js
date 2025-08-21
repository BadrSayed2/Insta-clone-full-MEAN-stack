const jwt = require("jsonwebtoken");
const { EventEmitter } = require("events");
const { confirmEmailTemplate } = require("./confirmEmailTemplate.js");
const { sendEmail } = require("./nodemailer.utils.js");

const emailEvent = new EventEmitter();

emailEvent.on("sendConfirmEmail", async ({ email } = {}) => {
  try {
    const tokenActive = jwt.sign({ email }, process.env.SECRET_KEY_ACTIVE, {
      expiresIn: "1h",
    });

    const link = `${tokenActive}`;

    await sendEmail({
      to: email,
      subject: "hello",
      html: confirmEmailTemplate({ link }),
    });
  } catch (err) {
    console.error("Email Event Error:", err.message);
  }
});

module.exports = { emailEvent };
