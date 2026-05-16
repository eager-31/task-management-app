import express from "express";
import { getDocumentById } from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getDocumentById);

export default router;