import { Router } from "express";
const router = Router();

import {renderIndex, ping, renderProduct} from "../controllers/index.controller.js";

router.get("/", renderProduct, renderIndex);
router.get('/ping', ping);

export default router;
