import express from "express";
import { logout, signin, signup } from "../controllers/auth.controller.js";
const router = express.Router();



router.post("/" , getMessage)





export default router;