import { Router } from "express";
import { isLoggedIn } from "../lib/auth.js";
import { renderUserProfile, renderUserview ,userEdit, renderPassword } from "../controllers/user.controller.js";

const router = Router();

router.get("/profile", isLoggedIn, renderUserProfile);
router.get("/user/view", isLoggedIn, renderUserview);
router.post("/user/edit", isLoggedIn, userEdit);
router.get("/user/password", isLoggedIn, renderPassword);

export default router;
