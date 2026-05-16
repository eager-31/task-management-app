import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";

describe("Task API", () => {
  let token;

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
  });

  test("should get tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("tasks");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});