import { Router } from "express";
import { getItemsByCategory } from "../controllers/home.controller.js";
const router = Router();
router.post("/getItems", getItemsByCategory);
export default router;
