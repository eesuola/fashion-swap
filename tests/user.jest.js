const request = require("supertest");
const app = require("../src/server");
const { sequelize, User } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("User Authentication", () => {
  let token;

  test("User can register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .field("name", "Test User")
      .field("email", "testuser@email.com")
      .field("password", "password123");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
  });

  test("User cannot register with existing email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .field("name", "Duplicate User")
      .field("email", "testuser@email.com")
      .field("password", "password123");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test("User can login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@email.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("User cannot login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@email.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  test("User can fetch their profile", async () => {
    const res = await request(app)
      .get("/api/auth")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@email.com");
  });

  test("User cannot fetch profile without token", async () => {
    const res = await request(app).get("/api/auth");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });
});
