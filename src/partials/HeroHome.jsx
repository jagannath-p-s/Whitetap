import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import gifImage from "../images/videos/video.gif";
import iPhoneImage from "../images/whitetap/iPhone.svg";

function HeroHome() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)" },
    tap: { scale: 0.95 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.6 } }
  };

  const mobileGifVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } }
  };

  return (
    <motion.section
      className="relative"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <motion.div
            className="text-center pb-12 md:pb-16"
            variants={textVariants}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-gray-900"
              data-aos="zoom-y-out"
            >
              Welcome to Your NFC Card Profile
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-lg md:text-xl text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Your complete profile, easily accessible through NFC technology.
                Share your information seamlessly with others.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <Link
                    className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                    to="/signup"
                  >
                    Get Your NFC Card
                  </Link>
                </motion.div>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <button
                    className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                    onClick={handleScrollDown}
                  >
                    Learn More
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className={`relative flex flex-col sm:flex-row items-center justify-center transition-opacity duration-500 ${
              isIntersecting ? "opacity-100" : "opacity-0"
            }`}
            variants={imageVariants}
          >
            <motion.img
              className="mx-auto mb-8 sm:mb-0 sm:mr-8"
              src={iPhoneImage}
              width="264"
              height="464"
              alt="iPhone"
              loading="lazy"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -50 }}
              transition={{ duration: 0.5 }}
            />
            {!isMobileView && (
              <motion.img
                className="mx-auto w-full sm:w-3/4 lg:w-1/2"
                src={gifImage}
                width="auto"
                height="auto"
                alt="GIF"
                loading="lazy"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 50 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
          {isMobileView && (
            <motion.img
              className={`mx-auto mb-8 transition-opacity duration-500 ${
                isIntersecting ? "opacity-100" : "opacity-0"
              }`}
              src={gifImage}
              width="auto"
              height="auto"
              alt="GIF"
              loading="lazy"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={mobileGifVariants}
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default HeroHome;
