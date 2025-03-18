// src/pages/Home.jsx
import React from "react";
import LocationModal from "../components/LocationModal";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import Catagory from "../components/Catagory";
import Banks from "./Banks";


const Home = () => {
  return (
    <>
      <LocationModal />
      <Mainsecsearch />
      <Catagory />
      <Banks />
    </>
  );
};

export default Home;
