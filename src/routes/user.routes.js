const express = require("express");
const router = express.Router();
const { jwtRequired } = require("../middleware/auth.middleware");


const userController = require("../controllers/user.controller");

router.get("/:id", jwtRequired, userController.getUserProfileById);
router.put("/update", jwtRequired, userController.updateUser);
router.delete("/:id", jwtRequired, userController.deleteUser);
router.get("/", jwtRequired, userController.getUserProfiles);

module.exports = router;
