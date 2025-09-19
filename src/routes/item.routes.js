const express = require("express");
const router = express.Router();
const multer = require("multer");
const { jwtRequired } = require("../middleware/auth.middleware");
const path = require("path");

const itemController = require("../controllers/item.controller");

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
  upload.array("photos", 5),
  jwtRequired,
  itemController.createItem
);
router.get("/", jwtRequired, itemController.getAllItems);
router.get("/:id", jwtRequired, itemController.getItemsById);
router.put(
  "/update/:id",
  upload.array("photos", 5),
  jwtRequired,
  itemController.updateItem
);
router.delete("/delete", jwtRequired, itemController.deleteAllItems);
router.delete("/:id", jwtRequired, itemController.deleteItemById);

module.exports = router;
