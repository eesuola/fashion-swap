const { Item, User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, status } = req.body;
    const photos = req.files ? req.files.map((file) => file.path) : [];
    if (!["user", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Only users or admins can create item" });
    }
    if (!title || !description || !category || !type || !status || !photos) {
      return res.status(404).json({ error: "All field are required" });
    }

    const existingitem = await Item.findOne({
      where: { title, description, category },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "avatar"],
        },
      ],
    });
    if (existingitem)
      return res.status(404).json({ error: "Item already exist" });

    const item = await Item.create({
      title,
      description,
      category,
      type: type || "swap" || "donate" || "sell",
      photos,
      status: status || "available" || "swapped" || "removed",
      ownerId: req.user.id,
    });
    res.json({
      message: "Item Posted",
      user: { id: item.id, title: item.title },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    const allItems = await Item.findAll({
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "name", "avatar", "location"],
      },
    });
    res.json(allItems);
  } catch (error) {
    console.error("Failed to retrieve items", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getItemsById = async (req, res) => {
  try {
    const itemId = req.params.id;
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    const item = await Item.findByPk(itemId, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "avatar", "location"],
        },
      ],
    });
    if (!item) {
      return res.status(404).json({ error: "Not Item Found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Failed to retrive item", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { title, description } = req.body;
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (req.user.role !== "admin" && item.userId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to update this post" });
    }
    let photos = item.photos;
    if (req.files && req.files.length > 0) {
      photos = req.files.map((file) => file.filename);
    }
    await item.update({
      title,
      description,
      photos,
    });
    res.json(item);
  } catch (error) {
    console.error("Failed to update Item", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteItemById = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    await Item.destroy({ where: { id } });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Failed to delete item", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteAllItems = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    await Item.destroy({ where: {} });
    res.json({ message: "All Item has been deleted" });
  } catch (error) {
    console.error("Failed to delete all items", error);
    res.status(500).json({ message: "Server error" });
  }
};
