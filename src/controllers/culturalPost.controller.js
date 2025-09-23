const { CulturalPost, User, Comment } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

exports.createCulturalPost = async (req, res) => {
  try {
    const { title, story, region, outfitType, likesCount } = req.body;
    const photos = req.files ? req.files.map((file) => file.filename) : [];

    if (!title || !story || !region || !outfitType || !photos) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingPost = await CulturalPost.findOne({
      where: { title, story, outfitType },
    });
    if (existingPost)
      return res.status(409).json({ error: "Post already exist" });

    if (!["user", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Only users or admins can create posts" });
    }

    const culturalPost = await CulturalPost.create({
      title,
      story,
      region,
      outfitType,
      likesCount,
      userId: req.user.id,
      photos,
    });
    res.status(201).json({
      id: culturalPost.id, // <-- add this
      message: "Cultural Post created successfully",
      post: {
        title: culturalPost.title,
        story: culturalPost.story,
        region: culturalPost.region,
        outfitType: culturalPost.outfitType,
        likesCount: culturalPost.likesCount,
        userId: culturalPost.userId,
        photos: culturalPost.photos,
        createdAt: culturalPost.createdAt,
        updatedAt: culturalPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCulturalPost = async (req, res) => {
  try {
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    const allCulturalPost = await CulturalPost.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "commenter",
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
    });
    res.json(allCulturalPost);
  } catch (error) {
    console.error("Failed to retrieve CulturalPost", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCulturalPostById = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await CulturalPost.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "commenter",
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
    });
    if (req.user.role !== "admin" && post.userId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to update this post" });
    }
    if (!post) {
      return res.status(404).json({ error: "Not Post Found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Failed to retrive Cultural Post", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCulturalPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, story, region, outfitType } = req.body;

    const post = await CulturalPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (req.user.role !== "admin" && post.userId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to update this post" });
    }
    let photos = post.photos; // keep existing if none uploaded
    if (req.files && req.files.length > 0) {
      photos = req.files.map((file) => file.filename);
    }
    await post.update({
      title,
      story,
      outfitType,
      region,
      photos,
    });
    res.json(post);
  } catch (error) {
    console.error("Failed to update Post", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCulturalPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await CulturalPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (req.user.role !== "admin" && post.userId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to delete this post" });
    }
    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete Post", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteCulturalPost = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "user") {
      return res.status(403).json({ error: "Only admin can delete all posts" });
    }

    await CulturalPost.destroy({ where: {} }); // deletes all rows & resets IDs

    res.json({ message: "All posts deleted successfully" });
  } catch (error) {
    console.error("Failed to delete all CulturalPost", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addCommentToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const {  text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Find the post
    const post = await CulturalPost.findByPk(postId, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "avatar"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "commenter",
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create the comment
    const userId = req.user.id;
    const comment = await Comment.create({
      userId,
      postId,
      text,
    });

    res.status(201).json({ id: comment.id, text: comment.text, userId: comment.userId });
  } catch (error) {
    console.error("Failed to add comment", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.findAll({
      order: [["createdAt", "DESC"]],
      where: { postId },
      include: [
        {
          model: User,
          as: "commenter", // must match the alias in the association
          attributes: ["id", "name", "avatar"],
        },
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error("Failed to retrieve comments", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const id = req.params.commentId;
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (req.user.role !== "admin" && comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not allowed to delete this comment" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete comment", error);
    res.status(500).json({ message: "Server error" });
  }
};
