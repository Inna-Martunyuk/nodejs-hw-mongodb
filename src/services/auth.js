import { User } from "../db/models/user.js";
import crypto, { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { SessionsCollection } from "../db/models/session.js";
import { sendEmail } from "../utils/sendMail.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import Handlebars from "handlebars";
import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import jwt from "jsonwebtoken";

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(401, "Email or password is incorrect");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, "Email or password is incorrect");
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(30).toString("base64");
  const refreshToken = crypto.randomBytes(30).toString("base64");

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({ _id: sessionId });

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const requestResetPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError.NotFound("User not found");
  }

  const token = jwt.sign(
    {
      sub: user._id,
    },
    getEnvVar("JWT_SECRET"),
    { expiresIn: "5m" }
  );

  const APP_DOMAIN = getEnvVar("APP_DOMAIN");
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  const templatePath = path.join(
    __dirname,
    "../templates/reset-password-email.html"
  );
  const html = await fs.readFile(templatePath, "utf-8");
  const template = Handlebars.compile(html);

  await sendEmail(
    user.email,
    "Reset your password",
    template({
      name: user.name,
      link: resetLink,
    })
  );
};

export const resetPwd = async (password, token) => {
  try {
    const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));

    const user = await User.findById(decoded.sub);

    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    await SessionsCollection.deleteMany({ userId: user._id });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    throw createHttpError(500, "Failed to reset password.");
  }
};
