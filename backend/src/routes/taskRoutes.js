import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadDocuments } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, uploadDocuments, createTask)
  .get(protect, getTasks);

router.route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;