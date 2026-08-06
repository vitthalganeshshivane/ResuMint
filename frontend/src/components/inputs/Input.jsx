import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <label
        className="text-xs font-medium"
        style={{ color: "var(--color-slate)" }}
        htmlFor=""
      >
        {label}
      </label>

      <div className="input-box">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
          style={{ color: "var(--color-ink)" }}
          value={value}
          onChange={(e) => onChange(e)}
        />

        <>
          {type === "password" &&
            (showPassword ? (
              <FaRegEye
                size={18}
                className="cursor-pointer"
                style={{ color: "var(--color-ink)" }}
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <FaRegEyeSlash
                size={18}
                className="cursor-pointer"
                style={{ color: "var(--color-dust)" }}
                onClick={() => toggleShowPassword()}
              />
            ))}
        </>
      </div>
    </div>
  );
};

export default Input;
