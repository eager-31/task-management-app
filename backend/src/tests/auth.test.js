import request from "supertest";
import app from "../app.js";
import prisma from "../config/prisma.js";

describe("Auth API", () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "123456",
    role: "USER",
  };

  test("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("should not register duplicate user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(400);
  });

  test("should not register with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "invalid-email",
        password: "123456",
        role: "USER",
      });

    expect(res.statusCode).toBe(400);
  });

  test("should not register with short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: `short${Date.now()}@example.com`,
        password: "123",
        role: "USER",
      });

    expect(res.statusCode).toBe(400);
  });

  test("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(401);
  });

  test("should not login with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
      });

    expect(res.statusCode).toBe(400);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});