import express from "express";
import { getDepartments, createDepartment } from "../controllers/departmentController.js";
import authHandler from "../middleware/authHandler.js";
import allowRoles from "../middleware/allowRoles.js";

const router = express.Router();

router.use(authHandler);

router.get("/", getDepartments);
router.post("/", allowRoles("admin"), createDepartment);

export default router;
