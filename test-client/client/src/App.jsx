// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Banks from "./pages/Banks";
import Merchants from "./pages/Merchants";
import Deals from "./pages/Deals";
import BranchDetails from "./pages/BranchDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banks/:cityId" element={<Banks />} />
        <Route path="/merchants/:bankId/:cityId" element={<Merchants />} />
        <Route path="/deals" element={<Deals />} />
        <Route
          path="/branches/:merchantId/:bankId/:cityId"
          element={<BranchDetails />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
