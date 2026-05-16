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
});

afterAll(async () => {
  await prisma.$disconnect();
});