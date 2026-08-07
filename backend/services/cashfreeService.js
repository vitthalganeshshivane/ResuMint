const { Cashfree } = require("cashfree-pg");

const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "production"
    ? Cashfree.PRODUCTION
    : Cashfree.SANDBOX,
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

  const response = await cashfree.PGCreateOrder(request);

  return {
    orderId: response.data.order_id,
    paymentSessionId: response.data.payment_session_id,
    orderStatus: response.data.order_status,
  };
};

const verifyOrder = async (orderId) => {
  const response = await cashfree.PGFetchOrder(orderId);

  return {
    orderId: response.data.order_id,
    orderStatus: response.data.order_status,
    orderAmount: response.data.order_amount,
    paymentMethod: response.data.payments?.[0]?.payment_method || null,
    paymentStatus: response.data.payments?.[0]?.payment_status || null,
  };
};

module.exports = {
  createOrder,
  verifyOrder,
  PLAN_AMOUNTS,
};
