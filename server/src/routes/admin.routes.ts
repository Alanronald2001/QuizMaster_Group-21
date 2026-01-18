import { getAdminDashboard } from "../controllers/admin.controller";
import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();
router.get("/", authenticate, authorize("ADMIN"), getAdminDashboard);
export default router;
