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

  const orderId = `resumint_${user._id}_${Date.now()}`;

  const returnUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/payment/verify?order_id=${orderId}`;

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
      return_url: returnUrl,
    },
    order_note: `ResuMint ${plan} plan subscription`,
  };

  console.log("[Cashfree] Creating order:", orderId);
  const response = await cashfree.PGCreateOrder(request);
  console.log("[Cashfree] Order created:", JSON.stringify(response.data, null, 2));

  const cfOrderId = response.data.order_id;
  const paymentSessionId = response.data.payment_session_id;

  // If Cashfree generated a different order_id, update the return URL
  // by re-saving the subscription with the Cashfree order_id
  if (cfOrderId !== orderId) {
    console.log("[Cashfree] CF order_id differs from our orderId. CF:", cfOrderId, "Ours:", orderId);
  }

  return {
    orderId: cfOrderId,
    paymentSessionId,
    orderStatus: response.data.order_status,
  };
};

const verifyOrder = async (orderId) => {
  console.log("[Cashfree] Fetching order:", orderId);
  const response = await cashfree.PGFetchOrder(orderId);
  console.log("[Cashfree] Order response:", JSON.stringify(response.data, null, 2));

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
