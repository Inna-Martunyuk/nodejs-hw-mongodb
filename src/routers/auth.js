import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";

import {
  loginSchema,
  registerSchema,
  requestResetPasswordSchema,
  resetPwdSchema,
} from "../validation/auth.js";
import {
  loginController,
  registerController,
  logoutController,
  refreshController,
  requestResetEmailController,
  resetPwdController,
} from "../controllers/auth.js";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(registerController)
);
router.post(
  "/login",
  validateBody(loginSchema),
  ctrlWrapper(loginController)
);
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/logout", ctrlWrapper(logoutController));
router.post(
  "/send-reset-email",
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetEmailController)
);
router.post("/reset-pwd", validateBody(resetPwdSchema), ctrlWrapper(resetPwdController));

export default router;
