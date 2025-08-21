const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const logger = require("./logger");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
