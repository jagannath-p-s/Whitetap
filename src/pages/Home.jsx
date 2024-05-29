import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import FeaturesHome from '../partials/Features';
import FeaturesBlocks from '../partials/FeaturesBlocks';
import Products from '../partials/Products';
import Newsletter from '../partials/Newsletter';
import Footer from '../partials/Footer';



function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <HeroHome />
        <FeaturesHome />
        <FeaturesBlocks />
        <Products />
        <Newsletter />

      </main>

   

      {/*  Site footer */}
      <Footer />

    </div>
  );
}

export default Home;