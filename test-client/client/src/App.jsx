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
import BranchDiscount from "./pages/BranchDiscount";
import BranchToBankDetails from "./pages/branchtobanks";
import LocationModal from "./components/LocationModal";
import Cookies from "js-cookie";
import Breadcrumbs from "./components/Breadcrumb";

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check cookies for city and bank
    const cityId = Cookies.get("selectedCityId");
    const bankId = Cookies.get("selectedBankId");
    const cityName = Cookies.get("selectedCityName");
    const bankName = Cookies.get("selectedBankName");

    if (cityId && bankId) {
      // If data exists, set state and redirect
      setSelectedCity({ id: cityId, name: cityName });
      setSelectedBank({ id: bankId, name: bankName });

      if (location.pathname === "/") {
        navigate(`/merchants/${bankId}/${cityId}`);
      }
    } else {
      // Show location modal for new users
      setShowLocationModal(true);
    }
  }, [navigate, location]);

  const handleCityBankSelection = (city, bank) => {
    // Save selected city and bank to state and cookies
    setSelectedCity(city);
    setSelectedBank(bank);
    Cookies.set("selectedCityId", city.id);
    Cookies.set("selectedCityName", city.name);
    Cookies.set("selectedBankId", bank.id);
    Cookies.set("selectedBankName", bank.name);

    setShowLocationModal(false);
    navigate(`/merchants/${bank.id}/${city.id}`);
  };

  return (
    <div>
      <Navbar
        selectedCity={selectedCity}
        selectedBank={selectedBank}
        onLocationChange={() => setShowLocationModal(true)}
      />
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onCityBankChange={handleCityBankSelection}
      />
       <Breadcrumbs />
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
