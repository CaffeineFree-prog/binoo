import { Router } from "express";
import { isLoggedIn } from "../lib/auth.js";
import { isAdmin, renderAdmin, adminProduct , addProduct , addProductProc, editProduct } from "../controllers/admin.controller.js";

const router = Router();
router.use(isLoggedIn);

router.get("/admin", isLoggedIn, isAdmin, renderAdmin);
router.get("/admin/product", isLoggedIn, isAdmin, adminProduct);
router.post("/admin/product", isLoggedIn, isAdmin, adminProduct);
router.get("/admin/addProduct", isLoggedIn, isAdmin, addProduct );
router.post("/admin/addProductProc", isLoggedIn, isAdmin, addProductProc );
router.get("/admin/product/edit", isLoggedIn, isAdmin, editProduct);

export default router;
