// src/pages/Home.jsx
import React from "react";
import LocationModal from "../components/LocationModal";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import Catagory from "../components/Catagory";


const Home = () => {
  return (
    <>
      <LocationModal />
      <Mainsecsearch />
      <Catagory />
    </>
  );
};

export default Home;
