import express from "express";
import { getAllContacts, getChatPartners, getMessagesById, sendMessage } from "../controllers/messages.controller.js";
import Protected from "../middlewares/protected.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use( Protected)

router.get("/contacts", Protected, getAllContacts)
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesById);
router.post("/send/:id", sendMessage);
export default router;

