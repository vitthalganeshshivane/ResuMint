const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY,
);

const PLAN_AMOUNTS = {
  pro: 299,
  max: 599,
};

const createOrder = async (user, plan) => {
  const amount = PLAN_AMOUNTS[plan];
  if (!amount) {
    throw new Error("Invalid plan selected");
  }

  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const request = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: user._id.toString(),
      customer_name: user.name || "",
      customer_email: user.email,
      customer_phone: "9999999999",
    },
    order_meta: {
      return_url: `${baseUrl}/payment/verify?order_id={order_id}`,
    },
    order_note: `ResuMint ${plan} plan subscription`,
  };

  console.log("[Cashfree] Creating order for plan:", plan, "amount:", amount);
  const response = await cashfree.PGCreateOrder(request);
  console.log("[Cashfree] Order created. CF order_id:", response.data.order_id, "status:", response.data.order_status);

  return {
    orderId: response.data.order_id,
    paymentSessionId: response.data.payment_session_id,
    orderStatus: response.data.order_status,
  };
};

const verifyOrder = async (orderId) => {
  console.log("[Cashfree] Verifying order:", orderId);
  const response = await cashfree.PGFetchOrder(orderId);
  console.log("[Cashfree] Order status:", response.data.order_status);

  const order = response.data;
  const payment = order.payments?.[0];

  return {
    orderId: order.order_id,
    orderStatus: order.order_status,
    orderAmount: order.order_amount,
    paymentMethod: payment?.payment_method || null,
    paymentStatus: payment?.payment_status || null,
  };
};

module.exports = {
  createOrder,
  verifyOrder,
  PLAN_AMOUNTS,
};
