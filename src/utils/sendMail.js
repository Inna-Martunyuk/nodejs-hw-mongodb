import nodemailer from "nodemailer";
import { getEnvVar } from "../utils/getEnvVar.js";
import createHttpError from "http-errors";

const transporter = nodemailer.createTransport({
  host: getEnvVar("SMTP_HOST"),
  port: Number(getEnvVar("SMTP_PORT")),
  secure: false, 
  auth: {
    user: getEnvVar("SMTP_USER"),
    pass: getEnvVar("SMTP_PASSWORD"),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${getEnvVar("SMTP_FROM")}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email successfully sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    throw createHttpError(
      500,
      "Failed to send the email, please try again later."
    );
  }
};
