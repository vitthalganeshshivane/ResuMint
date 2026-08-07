const express = require("express");
const { createOrder, verifyPayment, getSubscription } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.get("/verify", verifyPayment);
router.get("/subscription", protect, getSubscription);

module.exports = router;
