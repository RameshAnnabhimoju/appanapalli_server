import { Router } from "express";
import { getPincodeAddress } from "../controllers/pincode.controller.js";
const router = Router();
router.get("/", getPincodeAddress);
export default router;