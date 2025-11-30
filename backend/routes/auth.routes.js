import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import Protected from "../middlewares/protected.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";
const router = express.Router();
// router.use(arcjetProtection);

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", Protected, logout);

router.put("/update-profile", Protected, updateProfile);

router.get("/check", Protected, (req, res) => res.status(200).json({ user: req.user, message: "Authenticated" }))



export default router;
