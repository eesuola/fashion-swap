const request = require("supertest");
const app = require("../src/server");
const { sequelize, User } = require("../src/models");

let userToken, otherUserToken, postId, commentId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create User 1
  await User.create({
    name: "Poster",
    email: "poster@email.com",
    password: "password123",
  });

  // Create User 2
  await User.create({
    name: "Commenter",
    email: "commenter@email.com",
    password: "password123",
  });

  // Login User 1
  const res1 = await request(app)
    .post("/api/auth/login")
    .send({ email: "poster@email.com", password: "password123" });
  userToken = res1.body.token;

  // Login User 2
  const res2 = await request(app)
    .post("/api/auth/login")
    .send({ email: "commenter@email.com", password: "password123" });
  otherUserToken = res2.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Cultural Posts + Comments with Ownership Rules", () => {
  test("User 1 creates a post", async () => {
    const res = await request(app)
      .post("/api/post/create")
      .set("Authorization", `Bearer ${userToken}`)
      .field("title", "Traditional Festival")
      .field("story", "We celebrate this every year with family and friends.");

    expect(res.statusCode).toBe(201);
    postId = res.body.id;
  });

  test("User 2 comments on the post", async () => {
    const res = await request(app)
      .post(`/api/post/${postId}/comments`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ content: "This looks amazing! I’d love to join." });

    expect(res.statusCode).toBe(201);
    commentId = res.body.id;
  });

  test("User 2 cannot delete User 1's post", async () => {
    const res = await request(app)
      .delete(`/api/post/${postId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(403); // Forbidden
    expect(res.body.error).toMatch(/not allowed/i);
  });

  test("User 1 deletes their own post", async () => {
    const res = await request(app)
      .delete(`/api/post/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("User 1 cannot delete User 2's comment", async () => {
    // recreate post for comment deletion test
    const newPost = await request(app)
      .post("/api/post/create")
      .set("Authorization", `Bearer ${userToken}`)
      .field("title", "Music Festival")
      .field("story", "We play drums all night long.");

    const postId2 = newPost.body.id;

    const newComment = await request(app)
      .post(`/api/post/${postId2}/comments`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ content: "Nice vibes!" });

    const commentId2 = newComment.body.id;

    const res = await request(app)
      .delete(`/api/post/${postId2}/comments/${commentId2}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/not allowed/i);
  });

  test("User 2 deletes their own comment", async () => {
    const newPost = await request(app)
      .post("/api/post/create")
      .set("Authorization", `Bearer ${userToken}`)
      .field("title", "Dance Festival")
      .field("story", "We dance till dawn.");

    const postId3 = newPost.body.id;

    const newComment = await request(app)
      .post(`/api/post/${postId3}/comments`)
      .set("Authorization", `Bearer ${otherUserToken}`)
      .send({ content: "Can’t wait to attend!" });

    const commentId3 = newComment.body.id;

    const res = await request(app)
      .delete(`/api/post/${postId3}/comments/${commentId3}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
