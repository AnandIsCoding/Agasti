import React from "react";

import Footer from "../components/Footer";
import FeatureStrip from "../components/Landing/FeatureStrip";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Hero from "../components/Landing/Hero";
import PromoStrip from "../components/Landing/PromoStrip";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import HomeCategorySlider from "../components/slider/HomeCategorySlider";
import PopularProductSlider from "../components/slider/PopularProductSlider";

function Home() {
  return (
    <>
      <PromoStrip />
      <Navbar />

      <div className="w-full flex justify-center items-center ">
        <div className="w-full max-w-[1400px] bg-[#fffcf6]  md:max-w-[1600px] h-[200px] md:h-[540px] p-1 rounded-3xl animated-border">
          <video
            src="/Homepagevideo.mp4"
            autoPlay
            loop
            muted
            playsInline
            alt="PlutoIntero Video"
            className="w-full h-full object-cover rounded-2xl"
          ></video>
        </div>
      </div>

      <Navigation />
      <HomeCategorySlider />

      <PopularProductSlider />

      <FreeShippingBanner />
      <FeatureStrip />
      <Hero />
      <Footer />
    </>
  );
}

export default Home;
