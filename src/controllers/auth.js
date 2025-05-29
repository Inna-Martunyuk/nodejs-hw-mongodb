import { registerUser } from "../services/auth.js";
import { loginUser } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import { refreshSession } from "../services/auth.js";
import { THIRTY_DAYS } from "../constants/index.js";

export const registerController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
      });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie("sessionId", session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).end();
};


 const setupSession = (res, session) => {
   res.cookie("refreshToken", session.refreshToken, {
     httpOnly: true,
     expires: new Date(Date.now() + THIRTY_DAYS),
   });
   res.cookie("sessionId", session._id, {
     httpOnly: true,
     expires: new Date(Date.now() + THIRTY_DAYS),
   });
 };

 export const refreshController = async (req, res) => {
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
 };

