const express = require("express");
const router = express.Router();
const multer = require("multer");
const { jwtRequired } = require("../middleware/auth.middleware");
const path = require("path");

const culturalPostController = require("../controllers/culturalPost.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

router.post(
  "/create",
  upload.array("photos", 5), // Accept up to 5 files
  jwtRequired,
  culturalPostController.createCulturalPost
);

router.put(
  "/update/:id",
  jwtRequired,
  upload.array("photos", 5),
  culturalPostController.updateCulturalPost
);
router.delete(
  "/deleteall",
  jwtRequired,
  culturalPostController.deleteCulturalPost
);
router.delete(
  "/:id",
  jwtRequired,
  culturalPostController.deleteCulturalPostById
);
router.get("/", jwtRequired, culturalPostController.getAllCulturalPost);
router.get("/:id", jwtRequired, culturalPostController.getCulturalPostById);


//Comments routes
router.post(
  "/:id/comments",
  jwtRequired,
  culturalPostController.addCommentToPost
);
router.get(
  "/:id/comments",
  jwtRequired,
  culturalPostController.getCommentsForPost
);
router.delete(
  "/:id/comments/:commentId",
  jwtRequired,
  culturalPostController.deleteComment
);

module.exports = router;
