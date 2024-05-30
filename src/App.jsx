// src/App.jsx
import React, { useEffect, useState } from "react";
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
import ProtectedRoute from "./ProtectedRoute";
import supabase from "./supabase";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // state to track authentication status
  const [isAdmin, setIsAdmin] = useState(false); // state to track if user is admin

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

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        const { data, error } = await supabase
          .from("social_media_data")
          .select("*")
          .eq("email", email)
          .single();

        if (data) {
          setIsAuthenticated(true);
          setIsAdmin(data.is_admin);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user-home" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<UserHome />} />} />
        <Route path="/admin-home" element={<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} isAdminRoute={true} element={<AdminHome />} />} />
        <Route path="/profile/:userId" element={<ProtectedRoute unprotected element={<Customerside />} />} />
      </Routes>
    </>
  );
}

export default App;
