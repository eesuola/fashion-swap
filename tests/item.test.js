const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, Item } = require("../src/models");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create test user (password gets hashed by hook)
  await User.create({
    name: "Item User",
    email: "itemuser@email.com",
    password: "password123",
  });

  // Login to get JWT
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "itemuser@email.com", password: "password123" });

  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Item API", () => {
  test("Create a new item", async () => {
    const res = await request(app)
      .post("/api/items/create")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Blue Jeans")
      .field("description", "A nice pair of blue jeans")
      .field("category", "Clothing")
      .field("type", "swap")
      .attach("photos", "__tests__/fixtures/item.jpg");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Blue Jeans");
    expect(res.body).toHaveProperty("status", "available");
  });

  test("Reject creating item without token", async () => {
    const res = await request(app)
      .post("/api/items/create")
      .field("title", "Red Shirt");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Fetch items for logged-in user", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
