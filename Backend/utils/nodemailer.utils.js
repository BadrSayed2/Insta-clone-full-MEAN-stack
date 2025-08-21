import nodemailer from "nodemailer";
import dotenv from "dotenv";
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

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
