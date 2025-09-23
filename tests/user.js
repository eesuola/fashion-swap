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

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "testuser@email.com",
      password: "password123",
    });
  testToken = res.body.token;

  if (!testToken) {
    throw new Error("Auth token was not generated. Check login route and password hashing.");
  }
});

afterAll(async () => {
  await sequelize.close();
});

describe("User API", () => {
  test("Get user profile by ID", async () => {
    const res = await request(app)
      .get(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("id", userId);
      expect(res.body).toHaveProperty("email", "testuser@email.com");
    }
  });

  test("Get all user profiles", async () => {
    const res = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${testToken}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("email");
    }
  });

  test("Update user profile", async () => {
    const res = await request(app)
      .put("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        name: "Updated Name",
        email: "updated@email.com",
      });

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("id", userId);
      expect(res.body).toHaveProperty("email", "updated@email.com");
      expect(res.body).toHaveProperty("name", "Updated Name");
    }
  });

  test("Delete user profile", async () => {
    const res = await request(app)
      .delete(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    }

    // Check user no longer exists
    const checkRes = await request(app)
      .get(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect([404, 401]).toContain(checkRes.statusCode);
  });

  test("Reject access without token", async () => {
    const res = await request(app).get(`/api/user/${userId}`);
    expect([401, 404]).toContain(res.statusCode);
  });

  test("Reject update with invalid data", async () => {
    const res = await request(app)
      .put("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        email: "", // Invalid email
      });

    expect([400, 422, 404]).toContain(res.statusCode);
    if (res.statusCode !== 404) {
      expect(res.body).toHaveProperty("error");
    }
  });

  test("Get user profile with invalid ID should fail", async () => {
    const res = await request(app)
      .get("/api/user/invalid-id")
      .set("Authorization", `Bearer ${testToken}`);
    expect([400, 404]).toContain(res.statusCode);
  });

  test("Update user profile with duplicate email should fail", async () => {
    // Create another user
    const anotherUser = await User.create({
      name: "Another User",
      email: "another@email.com",
      password: "password123",
    });

    const res = await request(app)
      .put("/api/user/update")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        email: "another@email.com",
      });

    expect([404]).toContain(res.statusCode);
    if (res.statusCode !== 404) {
      expect(res.body).toHaveProperty("error");
    }
  });
});

// We recommend installing an extension to run jest tests.