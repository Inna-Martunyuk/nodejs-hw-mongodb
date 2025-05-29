import { UsersCollection } from "../db/models/user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { SessionsCollection } from "../db/models/session.js";

export const registerUser = async (payload) => {

     const user = await UsersCollection.findOne({ email: payload.email });
     if (user) throw createHttpError(409, "Email in use");

     const encryptedPassword = await bcrypt.hash(payload.password, 10);
     return await UsersCollection.create({
       ...payload,
       password: encryptedPassword,
     });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user === null) {
    throw createHttpError(401, "Email or passwor is incorect");
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (isEqual !== true) {
    throw createHttpError(401, "Email or passwor is incorect");
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
  const session = await SessionsCollection.findOne({_id: sessionId});

  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
