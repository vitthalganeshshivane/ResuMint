import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[380px] p-8 flex flex-col justify-center">
      <h3
        className="text-xl font-medium"
        style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}
      >
        Welcome Back
      </h3>
      <p
        className="text-sm mt-1 mb-7"
        style={{ color: "var(--color-slate)", fontWeight: 450 }}
      >
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />

        {error && (
          <p className="text-xs pb-2.5" style={{ color: "var(--color-signal-orange)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary">
          LOGIN
        </button>

        <p className="text-[13px] mt-4" style={{ color: "var(--color-slate)" }}>
          Don't have an account?{" "}
          <button
            className="font-medium cursor-pointer underline"
            style={{ color: "var(--color-ink)" }}
            onClick={() => setCurrentPage("signup")}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
