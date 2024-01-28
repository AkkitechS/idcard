import { Router } from "express";
import { 
    registerAdmin,
    adminLogin, 
    logoutAdmin 
} from "../controllers/admin.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(adminLogin);

// Secured routes
router.route("/logout").get(verifyJWT, logoutAdmin);


export default router;