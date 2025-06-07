import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPwd,
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

  try {
    await requestResetPassword(email);

    res
      .status(200)
      .json({
        "status": 200,
        "message": "Reset password email has been successfully sent.",
        "data": {}
      });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to send the email, please try again later.",
    });
  }
};


export const resetPwdController = async (req, res, next) => {
  try {
    const { password, token } = req.body;
    await resetPwd(password, token);

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

