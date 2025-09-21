const express = require("express");
const router = express.Router();
const { jwtRequired } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");


//User routes
router.get("/user/:id", jwtRequired, userController.getUserProfileById);
router.put("/user/update", jwtRequired, userController.updateUser);
router.delete("/user/:id", jwtRequired, userController.deleteUser);
router.get("/user", jwtRequired, userController.getUserProfiles);

module.exports = router;
