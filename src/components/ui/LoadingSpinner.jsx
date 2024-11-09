// src/components/LoadingSpinner.jsx

import React from "react";
import { motion } from "framer-motion";
import './LoadingSpinner.css'; // Make sure to create this CSS file

const LoadingSpinner = () => (
  <motion.div
    className="loader"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="loader-text">Loading...</div>
    <div className="loader-bar"></div>
  </motion.div>
);

export default LoadingSpinner;
