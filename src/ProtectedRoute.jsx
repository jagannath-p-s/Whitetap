// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAuthenticated, isAdmin, isAdminRoute, unprotected, ...rest }) => {
  if (unprotected) {
    return element;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/user-home" replace />;
  }

  return element;
};

export default ProtectedRoute;
