const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, Item, SwapRequest } = require("../src/models");

let testToken;
let userId;
let itemId;
let swapRequestId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    name: "Swap Tester",
    email: "swaptester@email.com",
    password: "password123",
    role: "user",
  });
  userId = user.id;
  const res = await request(app).post("/api/auth/login").send({
    email: "swaptester@email.com",
    password: "password123",
  });
  testToken = res.body.token;
  if (!testToken) {
    throw new Error(
      "Auth token was not generated. Check login route and password hashing."
    );
  }
  const itemRes = await request(app)
    .post("/api/items/create")
    .set("Authorization", `Bearer ${testToken}`)
    .field("name", "Test Item")
    .field("description", "This is a test item.")
    .field("category", "Clothing")
    .field("size", "M")
    .field("condition", "New")
    .attach("image", "tests/fixtures/test-item.jpg");
  itemId = itemRes.body.id;
});
afterAll(async () => {
  await sequelize.close();
});

describe("Swap Request Flow", () => {
  test("Create Swap Request", async () => {
    const res = await request(app)
      .post("/api/swaps/create")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        itemId: itemId,
        userId: userId,
      });
    swapRequestId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", swapRequestId);
  });
});
describe("Respond to Swap Request", () => {
  test("Respond to Swap Request", async () => {
    const res = await request(app)
      .post(`/api/swaps/${swapRequestId}/respond`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        status: "accepted",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", swapRequestId);
  });
});

describe("Complete Swap", () => {
  test("Complete Swap", async () => {
    // Ensure swap request is accepted before completing
    await request(app)
      .post(`/api/swaps/${swapRequestId}/respond`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ status: "accepted" });

    const res = await request(app)
      .post(`/api/swaps/${swapRequestId}/complete`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", swapRequestId);
  });
});

describe("Get Swap Request by ID", () => {
  test("Get Swap Request by ID", async () => {
    const res = await request(app)
      .get(`/api/swaps/${swapRequestId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", swapRequestId);
  });
});

describe("Get All Swap Requests for User", () => {
  test("Get All Swap Requests for User", async () => {
    const res = await request(app)
      .get(`/api/swaps/`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
describe("Delete Swap Request", () => {
  test("Delete Swap Request", async () => {
    const res = await request(app)
      .delete(`/api/swaps/${swapRequestId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(204);
  });
});

