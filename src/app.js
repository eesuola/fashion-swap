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
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

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
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    next();
  }
});
module.exports = app;
