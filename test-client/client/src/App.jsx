import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import CityModal from "./components/CityModal";

const App = () => {
  const [currentCity, setCurrentCity] = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCityId = sessionStorage.getItem("selectedCityId");
    const selectedCityName = sessionStorage.getItem("selectedCityName");

    if (selectedCityId && selectedCityName) {
      setCurrentCity({ id: selectedCityId, name: selectedCityName });
      navigate(`/banks/${selectedCityId}`);
    } else {
      setShowCityModal(true);
    }
  }, [navigate]);

  const handleCitySelect = (city) => {
    sessionStorage.setItem("selectedCityId", city.id);
    sessionStorage.setItem("selectedCityName", city.name);
    setCurrentCity(city);
    setShowCityModal(false);
    navigate(`/banks/${city.id}`);
  };

  return (
    <div>
      <Navbar currentCity={currentCity} />
      {showCityModal && (
        <CityModal
          show={showCityModal}
          onSelectCity={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}
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
          path="/branch-details/:merchant_Id/:branchId/:cityId"
          element={<BranchToBankDetails />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
