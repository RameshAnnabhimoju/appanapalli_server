import { Router } from "express";
import {
  manageDonation,
  addMultipleDonations,
  getDonations,
  updateMultipleDonations,
} from "../controllers/donation.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();
router.post("/xlsx/add", upload.single("file"), addMultipleDonations);
router.post("/xlsx/update", upload.single("file"), updateMultipleDonations);
router.post("/add", manageDonation);
router.patch("/update", manageDonation);
router.get("/", getDonations);
export default router;
