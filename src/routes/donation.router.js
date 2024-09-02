import { Router } from "express";
import {
  addMultipleDonations,
  getDonations,
  updateDonation,
  updateMultipleDonations,
} from "../controllers/donation.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.post("/xlsx/add", upload.single("file"), addMultipleDonations);
router.post("/xlsx/update", upload.single("file"), updateMultipleDonations);
router.patch("/update", updateDonation);
router.get("/", getDonations);
export default router;
