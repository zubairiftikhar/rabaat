import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Banks from "./pages/Banks";
import Merchants from "./pages/Merchants";
import Deals from "./pages/Deals";
import BranchDetails from "./pages/BranchDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DiscountDetail from "./pages/DiscountDetails";
import MerchantDiscount from "./pages/MerchantDiscount";
import BranchDiscount from "./pages/BranchDiscount";
import BranchToBankDetails from "./pages/branchtobanks";
import LocationModal from "./components/LocationModal";
import Cookies from "js-cookie";

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check cookies for city
    const cityId = Cookies.get("selectedCityId");
    const cityName = Cookies.get("selectedCityName");

    if (cityId) {
      // If data exists, set state and redirect
      setSelectedCity({ id: cityId, name: cityName });

      if (location.pathname === "/") {
        navigate(`/merchants/${cityId}`);
      }
    } else {
      // Show location modal for new users
      setShowLocationModal(true);
    }
  }, [navigate, location]);

  const handleCitySelection = (city) => {
    // Save selected city to state and cookies
    setSelectedCity(city);
    Cookies.set("selectedCityId", city.id);
    Cookies.set("selectedCityName", city.name);

    setShowLocationModal(false);
    navigate(`/merchants/${city.id}`);
  };

  return (
    <div>
      <Navbar
        selectedCity={selectedCity}
        onLocationChange={() => setShowLocationModal(true)}
      />
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onCityChange={handleCitySelection}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banks/:cityId" element={<Banks />} />
        <Route path="/merchants/:cityId" element={<Merchants />} />
        <Route path="/deals" element={<Deals />} />
        <Route
          path="/branches/:merchantId/:cityId"
          element={<BranchDetails />}
        />
        <Route path="/discounts/:discountId" element={<DiscountDetail />} />
        <Route
          path="/merchantdiscount/:merchantId/:bankId/:cityId"
          element={<MerchantDiscount />}
        />
        <Route
          path="/branchdiscount/:merchantId/:branchId/:bankId/:cityId"
          element={<BranchDiscount />}
        />
        <Route
          path="/branch-details/:branch_Id/:merchant_Id/:cityId"
          element={<BranchToBankDetails />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
