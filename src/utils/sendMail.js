import nodemailer from "nodemailer";
import { getEnvVar } from "../utils/getEnvVar.js";

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
  return await transporter.sendMail({
    from: getEnvVar("SMTP_FROM"),
    to,
    subject,
    html,
  });
};


