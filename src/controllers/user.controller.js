const { User } = require("../models");
const jwt = require("jsonwebtoken");
const logger = require("../logger");


exports.getUserProfiles = async (req, res) => {
  logger.debug("Fetching all user profiles");
  logger.info("Log metadata enabled:", config.logMetadata);

  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "avatar",
        "location",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    logger.error("Error fetching user profiles:", error);
    res.status(500).json({ error: "Failed to fetch user profiles" });
  }
};
exports.getUserProfileById = async (req, res) => {
  logger.debug("Fetching user profile by ID");
  logger.info("Log metadata enabled:", config.logMetadata);

  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });
    if (!user) {
      logger.warn("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    logger.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.updateUser = async (req, res) => {
  logger.debug("Updating user profile");
  logger.info("Log metadata enabled:", config.logMetadata);

  try {
    const  userId  = req.user.id;
    const { name, email } = req.body;

    const [updated] = await User.update(
      { name, email },
      { where: { id: userId } }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    logger.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};
exports.deleteUser = async (req, res) => {
  logger.debug("Deleting user profile");
  logger.info("Log metadata enabled:", config.logMetadata);
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    logger.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
