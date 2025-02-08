import { Router } from "express";
import {
  manageDonation,
  getDonations,
  manageMultipleDonations,
  downloadExcel
} from "../controllers/donation.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.get("/", getDonations);
router.get("/xlsx", downloadExcel);
router.post("/", manageDonation);
router.post("/xlsx", upload.single("file"), manageMultipleDonations);
export default router;
