import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <Navbar />
      {user && (
        <div className="container mx-auto max-w-5xl pt-2 pb-8 px-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
