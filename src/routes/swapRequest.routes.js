const express = require("express");
const router = express.Router();
const { jwtRequired } = require("../middleware/auth.middleware");
const swapRequestController = require("../controllers/swapRequest.controller");

router.post("/create", jwtRequired, swapRequestController.createSwapRequest);
router.put("/:id/respond", jwtRequired, swapRequestController.respondToSwapRequest);
router.put("/:id/complete", jwtRequired, swapRequestController.completeSwap);
router.get("/", jwtRequired, swapRequestController.getUserSwaps);

module.exports = router;
