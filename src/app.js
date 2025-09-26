const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const culturalPostRoutes = require("./routes/culturalPost.routes");
const swapRequestRoutes = require("./routes/swapRequest.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/post", culturalPostRoutes);
app.use("/api/swaps", swapRequestRoutes);

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error(" Database connection failed:", err));

app.get("/", (req, res) => {
  res.json({
    message: "Fashion Swap API",
    status: "Running",
    postman:
      "https://peter-5800517.postman.co/workspace/Peter's-Workspace~2df473a8-e544-43d1-8068-98f3f60c92d7/collection/43612780-f1be958b-e393-4fcd-85cd-b9533fa7ae6c",
  });
});

app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    next();
  }
});
module.exports = app;
