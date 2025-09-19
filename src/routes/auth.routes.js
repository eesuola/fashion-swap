const express = require("express");
const router = express.Router();
const multer = require("multer");
const body = require("express-validator").body;
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/auth.controller");

// Setup multer storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow a max of 5 requests per IP in the 15-minute window
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const registerValidationRules = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters long")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter A valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters long"),
];

const loginValidationRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a Valid email")
    .normalizeEmail(),
  body("password").exists().withMessage("Password is required"),
];

router.post("/register", upload.single("avatar"), registerValidationRules, authController.register);
router.post("/login", loginValidationRules, loginLimiter, authController.login);

module.exports = router;
