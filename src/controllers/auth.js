import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestReserPassword,
} from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";


export const registerController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.json({
      status: 200,
      message: "Successfully logged in a user!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const logoutController = async (req, res, next) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};


export const refreshController = async (req, res, next) => {
  try {
    const session = await refreshSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;

  await requestReserPassword(email);
  console.log(email);
  res.end();



};
