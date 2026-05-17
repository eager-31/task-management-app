import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";

describe("Task API", () => {
  let token;
  let taskId;

  beforeAll(async () => {
    const user = {
      email: `taskuser${Date.now()}@example.com`,
      password: "123456",
      role: "USER",
    };

    const res = await request(app)
      .post("/api/auth/register")
      .send(user);

    token = res.body.token;
  });

  test("should not get tasks without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
  });

  test("should not create task without title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Missing title",
        status: "PENDING",
        priority: "HIGH",
      });

    expect(res.statusCode).toBe(400);
  });

  test("should not create task with invalid status", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid Status Task",
        description: "Testing invalid status",
        status: "INVALID",
        priority: "HIGH",
      });

    expect(res.statusCode).toBe(400);
  });

  test("should return 400 when creating task with invalid priority", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid Priority Task",
        description: "Testing invalid priority",
        status: "PENDING",
        priority: "INVALID",
      });

    expect(res.statusCode).toBe(400);
  });

  test("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing task creation",
        status: "PENDING",
        priority: "HIGH",
        dueDate: "2026-05-20",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.task.title).toBe("Test Task");

    taskId = res.body.task.id;
  });

  test("should get tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(res.body).toHaveProperty("pagination");
  });

  test("should search tasks", async () => {
    const res = await request(app)
      .get("/api/tasks?search=Test")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("tasks");
  });

  test("should filter tasks by status", async () => {
    const res = await request(app)
      .get("/api/tasks?status=PENDING")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("should return 400 for invalid status filter", async () => {
    const res = await request(app)
      .get("/api/tasks?status=INVALID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("should return 400 for invalid priority filter", async () => {
    const res = await request(app)
      .get("/api/tasks?priority=INVALID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("should get task by id", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.task.id).toBe(taskId);
  });

  test("should return 400 for invalid task id", async () => {
    const res = await request(app)
      .get("/api/tasks/abc")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });

  test("should return 404 for non-existing task", async () => {
    const res = await request(app)
      .get("/api/tasks/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test("should update task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Test Task",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.title).toBe("Updated Test Task");
  });

  test("should delete task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("should return 404 for deleted task", async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});