const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");
const logger = require("../logger");
const config = require("../config/config");

const { SwapRequest, Item, User } = require("../models");

// Create a swap request
exports.createSwapRequest = async (req, res) => {
  logger.debug("Creating swap request");
  logger.info("Log metadata enabled:", config.logMetadata);
  try {
    const { fromItemId, toItemId, toUserId } = req.body;
    const fromUserId = req.user.id; // current logged in user

    // Check ownership of the offered item
    const fromItem = await Item.findByPk(fromItemId);
    if (!fromItem || fromItem.ownerId !== fromUserId) {
      logger.warn("User trying to swap an item they do not own");
      return res.status(400).json({ error: "You do not own this item" });
    }

    // Ensure target item exists
    const toItem = await Item.findByPk(toItemId);
    if (!toItem || toItem.ownerId !== toUserId) {
      logger.warn("Invalid target item");
      return res.status(400).json({ error: "Invalid target item" });
    }

    // Create the request
    const swap = await SwapRequest.create({
      fromUserId,
      toUserId,
      fromItemId,
      toItemId,
      status: "pending",
    });

    res.status(201).json(swap);
  } catch (error) {
    console.error("Failed to create swap request", error);
    logger.error("Failed to create swap request", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept or Decline swap
exports.respondToSwapRequest = async (req, res) => {
  logger.debug("Responding to swap request");
  logger.info("Log metadata enabled:", config.logMetadata);
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" or "declined"
    const userId = req.user.id;

    const swap = await SwapRequest.findByPk(id, {
      include: ["fromItem", "toItem"],
    });

    if (!swap) return res.status(404).json({ error: "Swap not found" });

    // Only the receiver can respond
    if (swap.toUserId !== userId) {
      logger.warn("User not authorized to respond to this swap");
      return res.status(403).json({ error: "Not authorized" });
    }

    if (!["accepted", "declined"].includes(status)) {
      logger.warn("Invalid swap status");
      return res.status(400).json({ error: "Invalid status" });
    }

    swap.status = status;
    await swap.save();

    // If accepted, reserve items
    if (status === "accepted") {
      await Item.update(
        { status: "swapped" },
        { where: { id: [swap.fromItemId, swap.toItemId] } }
      );
    }

    res.json(swap);
  } catch (error) {
    console.error("Failed to respond to swap request", error);
    logger.error("Failed to respond to swap request", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark swap as completed
exports.completeSwap = async (req, res) => {
  logger.debug("Completing swap");
  logger.info("Log metadata enabled:", config.logMetadata);
  try {
    const { id } = req.params;

    const swap = await SwapRequest.findByPk(id);
    if (!swap) return res.status(404).json({ error: "Swap not found" });

    if (swap.status !== "accepted") {
      logger.warn("Swap must be accepted first");
      return res.status(400).json({ error: "Swap must be accepted first" });
    }

    swap.status = "completed";
    await swap.save();

    // Mark items as swapped
    await Item.update(
      { status: "swapped" },
      { where: { id: [swap.fromItemId, swap.toItemId] } }
    );

    res.json(swap);
  } catch (error) {
    console.error("Failed to complete swap", error);
    logger.error("Failed to complete swap", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all swaps for logged in user
exports.getUserSwaps = async (req, res) => {
  logger.debug("Fetching user swaps");
  logger.info("Log metadata enabled:", config.logMetadata);
  try {
    const userId = req.user.id;
    if (!["user", "admin"].includes(req.user.role)) {
      logger.warn("Unauthorized access attempt");
      return res.status(403).json({ error: "Access denied" });
    }
    const swaps = await SwapRequest.findAll({
      where: {
        [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: [
        { model: Item, as: "fromItem" },
        { model: Item, as: "toItem" },
        {
          model: User,
          as: "fromUser",
          attributes: { exclude: ["password", "avatar", "email"] },
        },
        {
          model: User,
          as: "toUser",
          attributes: { exclude: ["password", "avatar", "email"] },
        },
      ],
    });

    res.json(swaps);
  } catch (error) {
    console.error("Failed to get user swaps", error);
    logger.error("Failed to get user swaps", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Swap Request
exports.deleteSwapRequest = async (req, res) => {
  logger.debug("Deleting swap request");
  logger.info("Log metadata enabled:", config.logMetadata);
  const request = await SwapRequest.findByPk(req.params.id);
  if (!request) return res.status(404).json({ error: "Not found" });

  if (request.fromUserId !== req.user.id && req.user.role !== "admin") {
    logger.warn("User not authorized to delete this swap");
    return res.status(403).json({ error: "Not allowed" });
  }

  await request.destroy();
  logger.info("Swap request deleted successfully");
  res.json({ message: "Request deleted" });
};
// Admin: Get All Swap Requests
exports.getAllSwapRequests = async (req, res) => {
  logger.debug("Fetching all swap requests");
  logger.info("Log metadata enabled:", config.logMetadata);
  if (req.user.role !== "admin") {
    logger.warn("Unauthorized access attempt");
    return res.status(403).json({ error: "Access denied" });
  }

  const requests = await SwapRequest.findAll({
    include: [
      { model: Item, as: "item", attributes: ["id", "title", "photos"] },
      { model: User, as: "fromUser", attributes: ["id", "name", "avatar"] },
      { model: User, as: "toUser", attributes: ["id", "name", "avatar"] },
    ],
  });

  res.json(requests);
};
