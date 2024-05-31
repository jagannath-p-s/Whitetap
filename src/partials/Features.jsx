import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Transition from "../utils/Transition";

import NFCBusinessCard from "../images/nfc-business-card.jpg";
import WebsitePreview from "../images/whitetap/iPhone.svg";

function Features() {
  const [tab, setTab] = useState(1);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const tabsRef = useRef(null);

  const heightFix = () => {
    if (tabsRef.current.children[tab]) {
      tabsRef.current.style.height =
        tabsRef.current.children[tab - 1].offsetHeight + "px";
    }
  };

  useEffect(() => {
    heightFix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.4 } }
  };

  return (
    <motion.section
      className="relative"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      {/* Section background */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={headerRef}
          className={`pt-12 md:pt-20 max-w-3xl mx-auto text-center pb-12 md:pb-16 transition-opacity duration-700`}
          variants={sectionVariants}
        >
          {/* Section header */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore the Solutions
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Introducing the NFC Business Card solution - a revolutionary way
              to share your information seamlessly with others.
            </p>
          </div>
        </motion.div>

        {/* Section content */}
        <motion.div
          ref={contentRef}
          className={`md:grid md:grid-cols-12 md:gap-6 transition-opacity duration-700`}
          variants={sectionVariants}
        >
          {/* Content */}
          <div className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6">
            <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-3">
                NFC Business Card
              </h3>
              <p className="text-lg sm:text-xl text-gray-600">
                A modern and convenient way to share your professional profile
                with a simple tap of a phone.
              </p>
            </div>
            {/* Tabs buttons */}
            <motion.div
              className={`mb-8 md:mb-0 transition-opacity duration-700`}
              variants={tabVariants}
            >
              <a
                className={`flex items-center text-base sm:text-lg p-4 sm:p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                  tab !== 1
                    ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                    : "bg-gray-200 border-transparent"
                }`}
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setTab(1);
                }}
              >
                <div>
                  <div className="font-bold leading-snug tracking-tight mb-1">
                    NFC Business Card
                  </div>
                  <div className="text-gray-600">
                    Share your professional profile with others using NFC
                    technology.
                  </div>
                </div>
                <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                  <svg
                    className="w-3 h-3 fill-current"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                  </svg>
                </div>
              </a>
              <a
                className={`flex items-center text-base sm:text-lg p-4 sm:p-5 rounded border transition duration-300 ease-in-out mb-3 ${
                  tab !== 2
                    ? "bg-white shadow-md border-gray-200 hover:shadow-lg"
                    : "bg-gray-200 border-transparent"
                }`}
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setTab(2);
                }}
              >
                <div>
                  <div className="font-bold leading-snug tracking-tight mb-1">
                    Online Profile
                  </div>
                  <div className="text-gray-600">
                    View a beautifully crafted online profile showcasing your
                    details.
                  </div>
                </div>
                <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                  <svg
                    className="w-3 h-3 fill-current"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z"
                      fillRule="nonzero"
                    />
                  </svg>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Tabs items */}
          <div
            className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1"
            ref={tabsRef}
          >
            <div className="relative flex flex-col text-center lg:text-right">
              {/* Item 1 */}
              <Transition
                show={tab === 1}
                appear={true}
                className="w-full"
                enter="transition ease-in-out duration-700 transform order-first"
                enterStart="opacity-0 translate-y-16"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-300 transform absolute"
                leaveStart="opacity-100 translate-y-0"
                leaveEnd="opacity-0 -translate-y-16"
              >
                <div className="relative inline-flex flex-col">
                  <motion.img
                    className={`md:max-w-none mx-auto rounded transition-opacity duration-700`}
                    src={NFCBusinessCard}
                    width="400"
                    height="362"
                    alt="NFC Business Card"
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={tabVariants}
                  />
                </div>
              </Transition>
              {/* Item 2 */}
              <Transition
                show={tab === 2}
                appear={true}
                className="w-full"
                enter="transition ease-in-out duration-700 transform order-first"
                enterStart="opacity-0 translate-y-16"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-300 transform absolute"
                leaveStart="opacity-100 translate-y-0"
                leaveEnd="opacity-0 -translate-y-16"
              >
                <div className="relative inline-flex flex-col">
                  <motion.img
                    className={`md:max-w-none md:mr-28 mx-auto rounded transition-opacity duration-700`}
                    src={WebsitePreview}
                    width="200"
                    height="362"
                    alt="Online Profile"
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={tabVariants}
                  />
                </div>
              </Transition>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Features;
