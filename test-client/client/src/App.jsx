import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactPixel from "react-facebook-pixel";
import Cookies from "js-cookie";
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
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/contactus";
import TermOfUse from "./pages/termsofuse";
import SearchByBank from "./pages/SearchByBank";
import MerchantsByBankAndCard from "./pages/MerchantsByBankAndCard";
import MerchantBankCardDiscount from "./pages/MerchantBankCardDiscount";
import Cards from "./pages/Cards";

const AppContent = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cityId = Cookies.get("selectedCityId");
    const cityName = Cookies.get("selectedCityName");

    if (cityName) {
      setSelectedCity({ id: cityId, name: cityName });
      if (location.pathname === "/") {
        navigate(`/${cityName}`);
      }
    } else {
      setShowLocationModal(true);
    }
  }, [navigate, location]);

  useEffect(() => {
    const options = {
      autoConfig: true,
      debug: false,
    };
    ReactPixel.init("3828318167481588", null, options);
    ReactPixel.pageView();
  }, []);

  const handleCitySelection = (city) => {
    setSelectedCity(city);
    Cookies.set("selectedCityId", city.id);
    Cookies.set("selectedCityName", city.name);

    setShowLocationModal(false);
    navigate(`/${city.name}`);
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
        <Route path="/:cityName" element={<Home />} />
        <Route path="/:cityName/Search-By-Bank" element={<SearchByBank />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Contact" element={<ContactUs />} />
        <Route path="/TermOfUse" element={<TermOfUse />} />
        <Route path="/:cityName/Bank" element={<Banks />} />
        <Route path="/:cityName/Category/:categoryName" element={<Merchants />} />
        <Route
          path="/:cityName/Bank/:bankName/:cardName/"
          element={<MerchantsByBankAndCard />}
        />
        <Route path="/:cityName/Bank/:bankName" element={<Cards />} />
        <Route
          path="/:cityName/Bank/:bankName/:cardName/:merchantName"
          element={<MerchantBankCardDiscount />}
        />
        <Route path="/deals" element={<Deals />} />
        <Route path="/:cityName/:merchantName" element={<BranchDetails />} />
        <Route path="/discounts" element={<DiscountDetail />} />
        <Route
          path="/:cityName/:merchantName/Bank/:bankName"
          element={<MerchantDiscount />}
        />
        <Route
          path="/:cityName/:bankName/:merchantName/Branch/:branchId/:branchAddress"
          element={<BranchDiscount />}
        />
        <Route
          path="/:cityName/:merchantName/Branch/:branchId/:branchAddress"
          element={<BranchToBankDetails />}
        />
      </Routes>
      <Footer />
    </div>
  );
};

// ✅ Wrap the entire app with GoogleOAuthProvider
const App = () => {
  return (
    <GoogleOAuthProvider clientId="732221825209-6tr387f7msb2ldjofft7ik49k4vg1fhs.apps.googleusercontent.com">
      <AppContent />
    </GoogleOAuthProvider>
  );
};

export default App;
