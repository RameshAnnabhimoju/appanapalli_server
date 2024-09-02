import { Router } from "express";
import {
  createUser,
  findUsers,
  getAllUsers,
  deleteUser,
  findUsersByRole,
} from "../controllers/user.controller.js";

const router = Router();
router.post("/add", createUser);
router.get("/getAll", getAllUsers);
router.get("/find/role", findUsersByRole);
router.get("/find", findUsers);
router.delete("/delete", deleteUser);
export default router;
