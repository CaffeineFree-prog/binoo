import { Router } from "express";
import auth from "./auth.routes.js";
import index from "./index.routes.js";
import user from "./user.routes.js";
import admin from "./admin.routes.js";
import product from "./product.routes.js";

const router = Router();

router.use(index);
router.use(auth);
router.use(user);
router.use(admin);
router.use(product);

export default router;
