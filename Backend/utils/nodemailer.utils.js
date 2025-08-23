const nodemailer = require("nodemailer");
const logger = require("./logger");
const ApiError = require("./api-error");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.MAIL_NAME}`,
      to,
      subject,
      ...(text && { text }),
      ...(html && { html }),
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    throw new ApiError("Failed to send email", 500);
    logger.error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendEmail };
