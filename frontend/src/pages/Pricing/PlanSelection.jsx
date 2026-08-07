import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuCheck, LuZap, LuCrown, LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { load } from "@cashfreepayments/cashfree-js";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the basics",
    features: [
      "Up to 2 resumes",
      "Basic templates",
      "Manual editing",
      "PDF export",
    ],
    buttonLabel: "Get Started",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹299",
    period: "/month",
    description: "Power up your job search with AI",
    features: [
      "Unlimited resumes",
      "All premium templates",
      "AI-powered suggestions",
      "AI resume analyzer",
      "Analysis history",
      "Priority support",
    ],
    buttonLabel: "Subscribe",
    highlighted: true,
  },
  {
    id: "max",
    name: "Max",
    price: "₹599",
    period: "/month",
    description: "The complete career toolkit",
    features: [
      "Everything in Pro",
      "Custom branding",
      "Export analytics",
      "Early access to features",
      "Dedicated support",
    ],
    buttonLabel: "Subscribe",
    highlighted: false,
  },
];

const PlanSelection = ({ onPlanSelected }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const initCashfree = async () => {
      const cf = await load({
        mode: import.meta.env.VITE_CASHFREE_MODE || "sandbox",
      });
      setCashfree(cf);
    };
    initCashfree();
  }, []);

  const handleFreePlan = () => {
    onPlanSelected?.();
    navigate("/dashboard");
  };

  const handlePaidPlan = async (planId) => {
    if (!cashfree) {
      toast.error("Payment system is loading. Please wait.");
      return;
    }

    setProcessing(planId);
    setSelectedPlan(planId);

    try {
      const response = await axiosInstance.post(API_PATHS.PAYMENT.CREATE_ORDER, {
        plan: planId,
      });

      const { paymentSessionId } = response.data;

      let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to start payment. Please try again.";
      toast.error(msg);
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="w-[92vw] md:w-[680px] p-8 flex flex-col justify-center">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-signal-orange)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase"
            style={{
              color: "var(--color-signal-orange)",
              letterSpacing: "0.08em",
            }}
          >
            Choose Your Plan
          </span>
        </div>
        <h3
          className="text-xl font-medium"
          style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
        >
          Select a plan to get started
        </h3>
        <p
          className="text-[13px] mt-1"
          style={{ color: "var(--color-slate)", fontWeight: 450 }}
        >
          You can always change your plan later from settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative flex flex-col p-5 transition-all duration-300"
            style={{
              borderRadius: "24px",
              border: plan.highlighted
                ? "2px solid var(--color-signal-orange)"
                : "1.5px solid var(--color-dust)",
              backgroundColor: plan.highlighted
                ? "var(--color-cream-lifted)"
                : "var(--color-cream-lifted)",
              boxShadow: plan.highlighted
                ? "0 4px 24px rgba(0,0,0,0.06)"
                : "none",
            }}
          >
            {plan.highlighted && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-semibold uppercase rounded-full"
                style={{
                  backgroundColor: "var(--color-signal-orange)",
                  color: "var(--color-cream)",
                  letterSpacing: "0.06em",
                }}
              >
                Popular
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                {plan.id === "max" ? (
                  <LuCrown
                    size={16}
                    style={{ color: "var(--color-signal-orange)" }}
                  />
                ) : plan.id === "pro" ? (
                  <LuZap
                    size={16}
                    style={{ color: "var(--color-signal-orange)" }}
                  />
                ) : null}
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: "var(--color-ink)" }}
                >
                  {plan.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span
                  className="text-2xl font-bold"
                  style={{
                    color: plan.highlighted
                      ? "var(--color-signal-orange)"
                      : "var(--color-ink)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: "var(--color-slate)" }}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className="text-[12px] mt-1"
                style={{ color: "var(--color-slate)" }}
              >
                {plan.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 mb-5 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "#DCFCE7",
                      color: "#16A34A",
                    }}
                  >
                    <LuCheck size={9} />
                  </div>
                  <span
                    className="text-[12px]"
                    style={{ color: "var(--color-ink)", fontWeight: 450 }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {plan.id === "free" ? (
              <button
                className="w-full text-[13px] font-medium rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-cream-lifted)",
                  color: "var(--color-ink)",
                  border: "1.5px solid var(--color-dust)",
                  padding: "10px 24px",
                }}
                onClick={handleFreePlan}
              >
                {plan.buttonLabel}
              </button>
            ) : (
              <button
                className="w-full text-[13px] font-medium rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: plan.highlighted
                    ? "var(--color-signal-orange)"
                    : "var(--color-ink)",
                  color: "var(--color-cream)",
                  border: plan.highlighted
                    ? "1.5px solid var(--color-signal-orange)"
                    : "1.5px solid var(--color-ink)",
                  padding: "10px 24px",
                  opacity: processing === plan.id ? 0.7 : 1,
                }}
                disabled={!!processing}
                onClick={() => handlePaidPlan(plan.id)}
              >
                {processing === plan.id ? (
                  <>
                    <LuLoader size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  plan.buttonLabel
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <p
        className="text-center text-[11px] mt-4"
        style={{ color: "var(--color-slate)" }}
      >
        Secure payments powered by Cashfree. Cancel anytime.
      </p>
    </div>
  );
};

export default PlanSelection;
