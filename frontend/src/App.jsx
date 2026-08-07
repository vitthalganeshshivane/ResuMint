import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Home/Dashboard";
import EditResume from "./pages/ResumeUpdate/EditResume";
import ProfilePage from "./pages/Profile/ProfilePage";
import AnalyzerPage from "./pages/Analyzer/AnalyzerPage";
import PaymentVerify from "./pages/Payment/PaymentVerify";
import UserProvider from "./context/userContext";
import ThemeProvider from "./context/themeContext";

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
              borderRadius: "12px",
            },
          }}
        />
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume/:resumeId" element={<EditResume />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/analyzer" element={<AnalyzerPage />} />
              <Route path="/payment/verify" element={<PaymentVerify />} />
            </Routes>
          </Router>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
