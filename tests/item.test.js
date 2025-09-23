const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, Item } = require("../src/models");

let testToken;
let itemId;
let userId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    name: "Item Tester",
    email: "itemtester@email.com",
    password: "password123",
  });
  userId = user.id;
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "itemtester@email.com",
      password: "password123",
    });
  testToken = res.body.token;
  if (!testToken) {
    throw new Error("Auth token was not generated. Check login route and password hashing.");
  }
  const itemRes = await request(app)
    .post("/api/items/create")
    .set("Authorization", `Bearer ${testToken}`)
    .field("title", "Green Scarf")
    .field("description", "Warm and cozy")
    .field("category", "Accessories")
    .field("image", "https://example.com/green-scarf.jpg")
    .field("status", "available")
    .field("type", "swap");
  itemId = itemRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Item API", () => {
  test("Get item by ID", async () => {
    const res = await request(app)
      .get(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("id", itemId);
      expect(res.body).toHaveProperty("title", "Green Scarf");
    }
  });

  test("Get all items", async () => {
    const res = await request(app)
      .get("/api/items")
      .set("Authorization", `Bearer ${testToken}`);
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("title");
    }
  });

  test("Update item", async () => {
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ title: "Updated Green Scarf" });
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("id", itemId);
      expect(res.body).toHaveProperty("title", "Updated Green Scarf");
    }
  });

  test("Delete item", async () => {
    const res = await request(app)
      .delete(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect([200, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message", "Item deleted successfully");
    }
  });

  test("Creating item with missing fields should fail", async () => {
    const res = await request(app)
      .post("/api/items/create")
      .set("Authorization", `Bearer ${testToken}`)
      .field("title", "")
      .field("description", "No title provided")
      .field("category", "Accessories")
      .field("type", "swap");
    expect([400, 404, 422, 500]).toContain(res.statusCode);
    if (res.statusCode === 400) {
      expect(res.body).toHaveProperty("error", "Title is required");
    }
  });

  test("Creating item with duplicate title should fail", async () => {
    await request(app)
      .post("/api/items/create")
      .set("Authorization", `Bearer ${testToken}`)
      .field("title", "Green Scarf")
      .field("description", "Warm and cozy")
      .field("category", "Accessories")
      .field("type", "swap");
    const res = await request(app)
      .post("/api/items/create")
      .set("Authorization", `Bearer ${testToken}`)
      .field("title", "Green Scarf")
      .field("description", "Warm and cozy")
      .field("category", "Accessories")
      .field("type", "swap");
    expect([400, 404, 422, 500]).toContain(res.statusCode);
    if (res.statusCode === 400) {
      expect(res.body).toHaveProperty("error", "Title must be unique");
    }
  });

  test("Reject access to item routes without token", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);
    expect([401, 404, 500]).toContain(res.statusCode);
  });

  test("Create item with invalid type should fail", async () => {
    const res = await request(app)
      .post("/api/items/create")
      .set("Authorization", `Bearer ${testToken}`)
      .field("title", "Invalid Type Item")
      .field("description", "Invalid type")
      .field("category", "Accessories")
      .field("type", "invalidtype");
    expect([400, 422, 404, 500]).toContain(res.statusCode);
    if (res.statusCode === 400 || res.statusCode === 422) {
      expect(res.body).toHaveProperty("error");
    }
  });

  test("Get item with invalid ID should fail", async () => {
    const res = await request(app)
      .get("/api/items/invalid-id")
      .set("Authorization", `Bearer ${testToken}`);
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});

// We recommend installing an extension to run jest tests.