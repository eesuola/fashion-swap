const request = require("supertest");
const app = require("../src/app");
const { sequelize, User } = require("../src/models");

let testToken;
let userId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    name: "Test User",
    email: "testuser@email.com",
    password: "password123",
  });
  userId = user.id;

  // Login to get token
  const res = await request(app).post("/api/auth/login").send({
    email: "testuser@email.com",
    password: "password123",
  });
  testToken = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("User API", () => {
  test("Get user profile by ID", async () => {
    const res = await request(app)
      .get(`/api/auth/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toHaveProperty("email", "testuser@email.com");
  });

  test("Get all user profiles", async () => {
    const res = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("email");
  });

  test("Update user profile", async () => {
    const res = await request(app)
      .put("/api/auth/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: "Updated Name",
        email: "updated@email.com",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
    expect(res.body).toHaveProperty("email", "updated@email.com");
    expect(res.body).toHaveProperty("name", "Updated Name");
  });

  test("Delete user profile", async () => {
    const res = await request(app)
      .delete(`/api/auth/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");

    // Check user no longer exists
    const checkRes = await request(app)
      .get(`/api/auth/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(checkRes.statusCode).toBe(404);
  });

  test("Reject access without token", async () => {
    const res = await request(app).get(`/api/auth/user/${userId}`);
    expect(res.statusCode).toBe(401);
  });

  test("Reject update with invalid data", async () => {
    const res = await request(app)
      .put("/api/auth/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        email: "", // Invalid email
      });

    expect([400, 422]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });
});


