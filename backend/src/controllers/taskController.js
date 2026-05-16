import prisma from "../config/prisma.js";
import { isValidPriority, isValidStatus } from "../utils/validators.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedToId,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const formattedStatus = status || "PENDING";
    const formattedPriority = priority || "MEDIUM";

    if (!isValidStatus(formattedStatus)) {
      return res.status(400).json({
        message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
      });
    }

    if (!isValidPriority(formattedPriority)) {
      return res.status(400).json({
        message: "Priority must be LOW, MEDIUM, or HIGH",
      });
    }

    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: Number(assignedToId) },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description,
        status: formattedStatus,
        priority: formattedPriority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: assignedToId ? Number(assignedToId) : null,
        createdById: req.user.id,
        documents: {
          create:
            req.files?.map((file) => ({
              fileName: file.originalname,
              filePath: `/uploads/${file.filename}`,
            })) || [],
        },
      },
      include: {
        assignedTo: {
          select: { id: true, email: true, role: true },
        },
        createdBy: {
          select: { id: true, email: true, role: true },
        },
        documents: true,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 6,
    } = req.query;

    const where = {};

    if (req.user.role !== "ADMIN") {
      where.OR = [
        { createdById: req.user.id },
        { assignedToId: req.user.id },
      ];
    }

    if (status) {
      if (!isValidStatus(status)) {
        return res.status(400).json({
          message: "Invalid status filter",
        });
      }

      where.status = status;
    }

    if (priority) {
      if (!isValidPriority(priority)) {
        return res.status(400).json({
          message: "Invalid priority filter",
        });
      }

      where.priority = priority;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const allowedSortFields = [
      "createdAt",
      "dueDate",
      "priority",
      "status",
      "title",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const safeOrder = order === "asc" ? "asc" : "desc";

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [tasks, totalTasks] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          [safeSortBy]: safeOrder,
        },
        include: {
          assignedTo: {
            select: { id: true, email: true, role: true },
          },
          createdBy: {
            select: { id: true, email: true, role: true },
          },
          documents: true,
        },
      }),

      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        totalTasks,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalTasks / limitNumber) || 1,
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: { id: true, email: true, role: true },
        },
        createdBy: {
          select: { id: true, email: true, role: true },
        },
        documents: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      task.createdById !== req.user.id &&
      task.assignedToId !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not allowed to view this task",
      });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (req.user.role !== "ADMIN" && existingTask.createdById !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed to update this task",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedToId,
    } = req.body;

    if (status && !isValidStatus(status)) {
      return res.status(400).json({
        message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
      });
    }

    if (priority && !isValidPriority(priority)) {
      return res.status(400).json({
        message: "Priority must be LOW, MEDIUM, or HIGH",
      });
    }

    if (assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: Number(assignedToId) },
      });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title ? title.trim() : existingTask.title,
        description:
          description !== undefined ? description : existingTask.description,
        status: status || existingTask.status,
        priority: priority || existingTask.priority,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        assignedToId:
          assignedToId === null || assignedToId === ""
            ? null
            : assignedToId
            ? Number(assignedToId)
            : existingTask.assignedToId,
      },
      include: {
        assignedTo: {
          select: { id: true, email: true, role: true },
        },
        createdBy: {
          select: { id: true, email: true, role: true },
        },
        documents: true,
      },
    });

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task update failed",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!taskId) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (req.user.role !== "ADMIN" && existingTask.createdById !== req.user.id) {
      return res.status(403).json({
        message: "Not allowed to delete this task",
      });
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Task deletion failed",
      error: error.message,
    });
  }
};