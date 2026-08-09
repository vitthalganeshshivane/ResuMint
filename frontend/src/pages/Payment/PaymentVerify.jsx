import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuLoader, LuCheck, LuX } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        setStatus("failed");
        setMessage("No order ID found. Please try again.");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${API_PATHS.PAYMENT.VERIFY}?order_id=${orderId}`
        );

        const { success, plan, user, message: payMsg } = response.data;

        if (success) {
          setStatus("success");
          setMessage(`Welcome to ResuMint ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`);

          if (user) {
            const token = localStorage.getItem("token");
            updateUser({ ...user, token });
          }

          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setStatus("failed");
          setMessage(payMsg || "Payment was not successful. Please try again.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage(
          error?.response?.data?.message ||
            "Failed to verify payment. Please contact support."
        );
      }
    };

    verifyPayment();
  }, [searchParams, navigate, updateUser]);

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div
        className="p-10 flex flex-col items-center text-center max-w-md"
        style={{
          backgroundColor: "var(--color-cream-lifted)",
          borderRadius: "24px",
          border: "1px solid var(--color-dust)",
        }}
      >
        {status === "verifying" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: "var(--color-cream)",
                border: "2px solid var(--color-dust)",
              }}
            >
              <LuLoader
                size={28}
                style={{ color: "var(--color-signal-orange)" }}
                className="animate-spin"
              />
            </div>
            <h2
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              Verifying Payment
            </h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-slate)" }}
            >
              {message}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#DCFCE7", color: "#16A34A" }}
            >
              <LuCheck size={28} />
            </div>
            <h2
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              Payment Successful!
            </h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-slate)" }}
            >
              {message}
            </p>
            <p
              className="text-[11px] mt-3"
              style={{ color: "var(--color-slate)" }}
            >
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              <LuX size={28} />
            </div>
            <h2
              className="text-lg font-medium mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              Payment Failed
            </h2>
            <p
              className="text-[13px] mb-5"
              style={{ color: "var(--color-slate)" }}
            >
              {message}
            </p>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 text-[13px] font-semibold rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-cream)",
                  border: "1.5px solid var(--color-ink)",
                  padding: "6px 18px",
                }}
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;
