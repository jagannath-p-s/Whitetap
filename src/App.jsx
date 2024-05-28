import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import "./css/style.css";
import AOS from "aos";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UserHome from "./pages/UserHome";
import AdminHome from "./pages/AdminHome";
import Customerside from "./pages/card/Customerside";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    if (location.pathname.endsWith('/')) {
      const newPath = location.pathname.slice(0, -1); // Remove the trailing slash
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/profile/:userId" element={<Customerside />} />
      </Routes>
    </>
  );
}

export default App;