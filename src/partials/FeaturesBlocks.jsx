import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import wireless from '../images/wireless.png'; 
import nfc from '../images/nfc.png';
import internet from '../images/internet.png';

function FeaturesBlocks() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
  };

  return (
    <motion.section
      className="relative"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <div className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-gray-900 pointer-events-none" aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="py-12 md:py-20 max-w-3xl mx-auto text-center pb-12 md:pb-20"
          variants={sectionVariants}
        >
          {/* Section header */}
          <h2 className="h2 mb-4 text-3xl sm:text-4xl font-bold">
            How White Tap NFC Business Cards Work
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Put your contact info directly onto customers’ devices with your White Tap NFC smart visiting card.
          </p>
        </motion.div>

        {/* Items */}
        <div className="max-w-sm md:py-3 pb-3 mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
          {/* 1st item */}
          <motion.div
            className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <img src={wireless} className="w-16 h-16 p-1 -mt-1 mb-2" alt="Wireless" />
            <h4 className="text-xl font-semibold leading-snug tracking-tight mb-1">
              Hand holding NFC card
            </h4>
            <p className="text-gray-600 text-center">
              Put your contact info directly onto customers’ devices with your NFC smart business card.
            </p>
          </motion.div>
          {/* 2nd item */}
          <motion.div
            className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <img src={nfc} className="w-16 h-16 p-1 -mt-1 mb-2" alt="NFC Technology" />
            <h4 className="text-xl font-semibold leading-snug tracking-tight mb-1">
              NFC Technology
            </h4>
            <p className="text-gray-600 text-center">
              People hold their phone over the NFC business card to activate the phone’s built-in scanning technology.
            </p>
          </motion.div>
          {/* 3rd item */}
          <motion.div
            className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg"
            variants={itemVariants}
          >
            <img src={internet} className="w-16 h-16 p-1 -mt-1 mb-2" alt="Website" />
            <h4 className="text-xl font-semibold leading-snug tracking-tight mb-1">
              Website
            </h4>
            <p className="text-gray-600 text-center">
              Customers can visit your profile on our website to learn more about you and your business.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default FeaturesBlocks;
