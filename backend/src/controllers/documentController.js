import path from "path";
import prisma from "../config/prisma.js";

export const getDocumentById = async (req, res) => {
  try {
    const documentId = Number(req.params.id);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        task: true,
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const task = document.task;

    if (
      req.user.role !== "ADMIN" &&
      task.createdById !== req.user.id &&
      task.assignedToId !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed to view this document" });
    }

    const filePath = path.join(process.cwd(), "src", "uploads", path.basename(document.filePath));

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve document",
      error: error.message,
    });
  }
};