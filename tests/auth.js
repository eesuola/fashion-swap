const request = require("supertest");
const app = require("../src/app"); 
const { sequelize, User } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await User.create({
    name: "Login User",
    email: "loginuser@email.com",
    password: "password123", 
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth API", () => {
  test("Login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser@email.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");

    
    global.testToken = res.body.token;
  });

  test("Reject login with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "loginuser@email.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Access protected route with token", async () => {
    const res = await request(app)
      .get("/api/items") 
      .set("Authorization", `Bearer ${global.testToken}`);

    expect([200, 404]).toContain(res.statusCode); 

  });

  test("Access protected route without token should fail", async () => {
    const res = await request(app).get("/api/items");
    expect(res.statusCode).toBe(401);
  });
});