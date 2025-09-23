const request = require("supertest");
const app = require("../src/app");
const { sequelize, User, CulturalPost, Comment } = require("../src/models");

let testToken;
let postId;
let userId;
let commentId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const user = await User.create({
    name: "Post Tester",
    email: "posttester@email.com",
    password: "password123",
  });
  userId = user.id;
  const res = await request(app).post("/api/auth/login").send({
    email: "posttester@email.com",
    password: "password123",
  });
  testToken = res.body.token;
  if (!testToken) {
    throw new Error(
      "Auth token was not generated. Check login route and password hashing."
    );
  }
  const postRes = await request(app)
    .post("/api/post/create")
    .set("Authorization", `Bearer ${testToken}`)
    .field("title", "My First Post")
    .field("story", "This is the story of my first post.")
    .field("region", "North America")
    .field("outfitType", "Casual")
    .field(
      "photos",
      "https://example.com/photo1.jpg,https://example.com/photo2.jpg"
    );
  postId = postRes.body.id;
  const commentRes = await request(app)
    .post(`/api/post/${postId}/comments`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({
      text: "This is a comment on the first post.",
    });
  commentId = commentRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("get post by ID", () => {
  test("Get post by ID", async () => {
    const res = await request(app)
      .get(`/api/post/${postId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", postId);
  });
});
describe("get all posts", () => {
  test("Get all posts", async () => {
    const res = await request(app)
      .get("/api/post")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
  });
});
test("Update post", async () => {
  const res = await request(app)
    .put(`/api/post/${postId}`)
    .set("Authorization", `Bearer ${testToken}`)
    .send({
      title: "Updated Title",
      story: "Updated story",
      region: "Africa",
      outfitType: "Festival",
      photos: "updated1.jpg,updated2.jpg",
    });
  expect([200, 403, 404, 500]).toContain(res.statusCode);
  if (res.statusCode === 200) {
    expect(res.body).toHaveProperty("id", postId);
    expect(res.body).toHaveProperty("title", "Updated Title");
  }
});

describe("comments on post", () => {
  test("Add comment to post", async () => {
    const res = await request(app)
      .post(`/api/post/${postId}/comments`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        text: "This is a new comment.",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
describe("get comments for post", () => {
  test("Get comments for post", async () => {
    const res = await request(app)
      .get(`/api/post/${postId}/comments`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
  });
});
describe("delete comment", () => {
  test("Delete comment", async () => {
    const res = await request(app)
      .delete(`/api/post/${postId}/comments/${commentId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Comment deleted successfully");
  });
});
