import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  loginSchema,
  registerSchema,
  requestResetPasswordSchema,
} from "../validation/auth.js";
import {
  loginController,
  registerController,
  logoutController,
  refreshController,
  requestResetEmailController,
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
  ctrlWrapper(requestResetEmailController),
  validateBody(requestResetPasswordSchema)
);

export default router;
