import { Router } from "express";
import { isLoggedIn } from "../lib/auth.js";
const router = Router();

import {
  renderSignUp,
  signUp,
  renderSignIn,
  signIn,
  logout,
  renderChangePw
} from "../controllers/auth.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { signupSchema } from "../validators/signup.validator.js";

//signup
router.get("/signup", renderSignUp);
router.post("/signup", signupSchema, validator, signUp);

//signin
router.get("/signin", renderSignIn);
router.post("/signin", signIn);

//logout
router.get("/logout", logout);

//changePw
router.post("/edit/password", isLoggedIn , renderChangePw);

export default router;
