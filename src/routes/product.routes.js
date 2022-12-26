import { Router } from "express";
import {
    renderProductList,
    renderCategoryList,
    viewProduct
} from "../controllers/product.controller.js";

const router = Router();
router.get("/product", renderProductList);
router.get("/product/view/:id", viewProduct);
router.get("/product/categoryList/:id", renderCategoryList);

export default router;
