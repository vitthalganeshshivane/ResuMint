const User = require("../models/User");
const Subscription = require("../models/Subscription");
const cashfreeService = require("../services/cashfreeService");

const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !["pro", "max"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan. Choose pro or max." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingSubscription = await Subscription.findOne({
      userId: user._id,
      status: "paid",
    });

    if (existingSubscription) {
      return res.status(400).json({ message: "You already have an active subscription" });
    }

    const { orderId, paymentSessionId } = await cashfreeService.createOrder(user, plan);

    await Subscription.create({
      userId: user._id,
      orderId,
      plan,
      amount: cashfreeService.PLAN_AMOUNTS[plan],
      status: "created",
    });

    res.status(200).json({
      orderId,
      paymentSessionId,
      plan,
      amount: cashfreeService.PLAN_AMOUNTS[plan],
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    console.log("[Payment Verify] Verifying order:", order_id);

    const subscription = await Subscription.findOne({ orderId: order_id });
    if (!subscription) {
      console.log("[Payment Verify] Subscription not found for order:", order_id);
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status === "paid") {
      console.log("[Payment Verify] Order already verified:", order_id);
      const user = await User.findById(subscription.userId).select("-password");
      return res.status(200).json({
        success: true,
        plan: subscription.plan,
        user,
      });
    }

    const orderDetails = await cashfreeService.verifyOrder(order_id);
    console.log("[Payment Verify] Cashfree order status:", orderDetails.orderStatus, "payment status:", orderDetails.paymentStatus);

    if (orderDetails.orderStatus === "PAID") {
      subscription.status = "paid";
      subscription.paidAt = new Date();
      subscription.paymentMethod = orderDetails.paymentMethod;
      await subscription.save();

      await User.findByIdAndUpdate(subscription.userId, { plan: subscription.plan });

      const user = await User.findById(subscription.userId).select("-password");

      console.log("[Payment Verify] Payment confirmed. User plan updated to:", subscription.plan);
      return res.status(200).json({
        success: true,
        plan: subscription.plan,
        user,
      });
    } else {
      subscription.status = orderDetails.orderStatus === "EXPIRED" ? "expired" : "failed";
      await subscription.save();

      console.log("[Payment Verify] Payment not successful. Status:", orderDetails.orderStatus);
      return res.status(200).json({
        success: false,
        status: subscription.status,
        message: `Payment ${subscription.status}. Please try again.`,
      });
    }
  } catch (error) {
    console.error("[Payment Verify] Error:", error);
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};

const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: "paid",
    }).sort({ paidAt: -1 });

    const user = await User.findById(req.user.id).select("plan");

    res.status(200).json({
      plan: user.plan || "free",
      subscription: subscription || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscription", error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getSubscription,
};
