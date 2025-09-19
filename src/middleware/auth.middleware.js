const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/db");

function jwtRequired(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Expected format: "Bearer token"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Token invalid or expired" });
  }
}


function jwtOptional(req, res, next) {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
  try {
    if (token) req.user = jwt.verify(token, jwtSecret);
  } catch (error) {}
  next();
}

module.exports = {
  jwtRequired,
  jwtOptional,
};
