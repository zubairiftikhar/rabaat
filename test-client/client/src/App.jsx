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
import DiscountDetail from "./pages/DiscountDetails";
import BranchDiscount from "./pages/BranchDiscount";
import BranchToBankDetails from "./pages/branchtobanks";

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
        <Route path="/discounts/:discountId" element={<DiscountDetail />} />
        <Route
          path="/branchdiscount/:branchId/:merchantId/:bankId/:cityId"
          element={<BranchDiscount />}
        />
        <Route
          path="/branch-details/:branchId/:cityId"
          element={<BranchToBankDetails />}
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
