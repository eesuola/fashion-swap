const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const logger = require("../logger");


exports.register = async (req, res) => {
  logger.debug("User registration initiated");
  logger.info("Log metadata enabled:", config.logMetadata);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("User registration validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, location } = req.body;
    const avatarPath = req.file ? req.file.path : null;
    if (!name || !email || !password || !location)
      return res.status(404).json({ error: "All field are required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarPath,
      location,
    });

    res.json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  logger.debug("User login initiated");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("User login validation failed", { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT Payload
    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET;

    const jwtOptions = {
      expiresIn: "12h",
      // algorithm: "HS256",
    };
    const token = jwt.sign(payload, secret, jwtOptions);
    console.log(token);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token is required" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "supersecretkey",
    (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET || "supersecretkey",
        { expiresIn: "1h" }
      );

      res.json({ token: newToken });
    }
  );
};

exports.forgotPassword = async (req, res) => {
  logger.debug("Password reset requested");
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Generate password reset token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Send email with reset link (pseudo-code)
  await sendPasswordResetEmail(email, token);

  res.json({ message: "Password reset email sent" });
};

exports.logoutUser = (req, res) => {};
