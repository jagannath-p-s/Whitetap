import React, { useState, useEffect, useRef } from "react";
import gifImage from "../images/videos/video.gif"; // Import GIF image
import iPhoneImage from "../images/whitetap/iPhone.svg"; // Standard import for iPhone SVG image

function HeroHome() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const heroSectionRef = useRef(null);
  const observer = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    const handleIntersection = (entries) => {
      const [entry] = entries;
      setIsIntersecting(entry.isIntersecting);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (heroSectionRef.current) {
      observer.current.observe(heroSectionRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer.current && heroSectionRef.current) {
        observer.current.unobserve(heroSectionRef.current);
      }
    };
  }, []);

  return (
    <section className="relative" ref={heroSectionRef}>
      {/* Illustration behind hero content */}
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
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
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
                <div>
                  <a
                    className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                    href="#0"
                  >
                    Get Your NFC Card
                  </a>
                </div>
                <div>
                  <a
                    className="btn text-white bg-gray-900 hover:bg-gray-800 w-full sm:w-auto sm:ml-4"
                    href="#0"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image and iPhone SVG */}
          <div
            className={`relative flex flex-col sm:flex-row items-center transition-opacity duration-500 ${
              isIntersecting ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* iPhone SVG */}
            <img
              className="mx-auto mb-8 sm:mb-0 sm:mr-8"
              src={iPhoneImage}
              width="264"
              height="464"
              alt="iPhone"
              loading="lazy" // Lazy loading attribute for better performance
            />
            {/* GIF image */}
            {!isMobileView && (
              <img
                className="mx-auto w-full sm:w-3/4 lg:w-1/2"
                src={gifImage}
                width="auto"
                height="auto"
                alt="GIF"
                loading="lazy" // Lazy loading attribute for better performance
              />
            )}
          </div>
          {/* GIF image (for mobile view) */}
          {isMobileView && (
            <img
              className={`mx-auto mb-8 transition-opacity duration-500 ${
                isIntersecting ? "opacity-100" : "opacity-0"
              }`}
              src={gifImage}
              width="auto"
              height="auto"
              alt="GIF"
              loading="lazy" // Lazy loading attribute for better performance
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
