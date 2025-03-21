// src/pages/Home.jsx
import React from "react";
import LocationModal from "../components/LocationModal";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import Catagory from "../components/Catagory";
import Banks from "./Banks";
import Mobileapp from "../components/Mobileapp";
import Reviews from "../components/reviews/Reviews";


const Home = () => {
  return (
    <>
      <LocationModal />
      <Mainsecsearch />
      <Catagory />
      <Banks />
      <Mobileapp />
      <Reviews />
    </>
  );
};

export default Home;
