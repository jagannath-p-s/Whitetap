import React, { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import ReactCardFlip from "react-card-flip";

import greenBack from "../images/whitetap/greenBack.jpg";
import greenFront from "../images/whitetap/greenFront.jpg";
import peachBack from "../images/whitetap/peachBack.jpg";
import peachFront from "../images/whitetap/peachFront.jpg";
import whiteBack from "../images/whitetap/whiteBack.jpg";
import whiteFront from "../images/whitetap/whiteFront.jpg";

function Products() {
  const [selectedColor, setSelectedColor] = useState("green");
  const [isFrontView, setIsFrontView] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setIsFrontView(true); // Reset to front view when color changes
  };

  const getCardImage = () => {
    if (selectedColor === "green") {
      return isFrontView ? greenFront : greenBack;
    } else if (selectedColor === "peach") {
      return isFrontView ? peachFront : peachBack;
    } else {
      return isFrontView ? whiteFront : whiteBack;
    }
  };

  const toggleView = () => {
    setIsFrontView(!isFrontView);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="relative bg-gray-100 py-12">
      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mt-14 pb-12 md:pb-16">
        <h2 className="h2 mb-4 font-bold text-3xl text-gray-800">
          NFC Business Cards
        </h2>
        <p className="text-xl text-gray-600">
          Choose your favorite color and view our NFC business cards.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row justify-center items-center md:space-x-32">
        {/* Color selection buttons */}
        <div className="flex md:flex-col justify-center mb-8 md:-mt-10 space-x-4 md:space-x-0 md:space-y-4">
          <button
            className={`w-16 h-16 rounded-full border-4 transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg focus:outline-none ${
              selectedColor === "green"
                ? "border-green-500 ring-2 ring-green-500 ring-offset-2"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: "darkgreen" }}
            onClick={() => handleColorChange("green")}
            aria-label="Select Green Color"
          ></button>
          <button
            className={`w-16 h-16 rounded-full border-4 transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg focus:outline-none ${
              selectedColor === "peach"
                ? "border-orange-500 ring-2 ring-orange-500 ring-offset-2"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: "peachpuff" }}
            onClick={() => handleColorChange("peach")}
            aria-label="Select Peach Color"
          ></button>
          <button
            className={`w-16 h-16 rounded-full border-4 transition duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg focus:outline-none ${
              selectedColor === "white"
                ? "border-gray-400 ring-2 ring-gray-400 ring-offset-2"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: "white" }}
            onClick={() => handleColorChange("white")}
            aria-label="Select White Color"
          ></button>
        </div>

        {/* Card image */}
        <div className="flex flex-col items-center">
          <div className="md:max-w-2xl max-w-full relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            )}
            <ReactCardFlip
              isFlipped={!isFrontView}
              flipDirection="horizontal"
              containerClassName="react-card-flip transition duration-500 ease-in-out transform hover:scale-105"
            >
              <img
                className="max-h-screen px-5 md:px-0 w-auto rounded shadow-lg transition-opacity duration-500 ease-in-out"
                style={{ opacity: isLoading ? 0 : 1 }}
                src={getCardImage()}
                alt={`${selectedColor} card front`}
                onLoad={handleImageLoad}
              />
              <img
                className="max-h-screen px-5 md:px-0 w-auto rounded shadow-lg transition-opacity duration-500 ease-in-out"
                style={{ opacity: isLoading ? 0 : 1 }}
                src={getCardImage()}
                alt={`${selectedColor} card back`}
                onLoad={handleImageLoad}
              />
            </ReactCardFlip>
          </div>

          {/* View toggle button */}
          <div className="mt-8">
            <button
              className="flex items-center justify-center px-6 py-3 rounded-full text-lg font-semibold mb-7 text-white transition duration-300 ease-in-out focus:outline-none focus:ring-2 bg-gray-900 hover:bg-gray-800"
              onClick={toggleView}
            >
              <FaExchangeAlt size={24} className="mr-2" />
              Flip Card
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
