import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../assets/img/landing/Rabaat_logo.svg";
import Cookies from "js-cookie";

const Navbar = ({ selectedCity, selectedBank, onLocationChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [currentBank, setCurrentBank] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Update state when the city or bank changes
  const updateCityAndBank = (cityName, bankName) => {
    setCurrentCity(cityName);
    setCurrentBank(bankName);
    Cookies.set("selectedCityName", cityName);
    Cookies.set("selectedBankName", bankName);
  };

  useEffect(() => {
    const user = Cookies.get("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }

    const cityName = Cookies.get("selectedCityName");
    const bankName = Cookies.get("selectedBankName");

    setCurrentCity(cityName || "Select City");
    setCurrentBank(bankName || "Select Bank");
  }, []);

  const handleLogout = () => {
    Cookies.remove("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <div className="container-fluid px-5 rabaat_nav_bg">
      <nav className="navbar navbar-expand-lg">
        <Link className="navbar-brand" to="/">
          <img src={rabaat_logo} alt="Rabaat" style={{ width: "62px" }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="btn btn-outline-light me-3"
                onClick={onLocationChange}
              >
                {`City: ${selectedCity ? selectedCity.name : "Select City"}`}
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light me-3"
                onClick={onLocationChange}
              >
                {`Bank: ${selectedBank ? selectedBank.name : "Select Bank"}`}
              </button>
            </li>
            <li className="nav-item">
              {loggedInUser ? (
                <>
                  <FaUserCircle className="me-2" size={20} />
                  <span>{loggedInUser}</span>
                  <button
                    className="btn btn-danger ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="btn rabaat_login_btn ms-3"
                  onClick={() => setShowAuthModal(true)}
                >
                  Log in
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <AuthModal
        show={showAuthModal}
        handleClose={() => setShowAuthModal(false)}
        initialType={authModalType}
      />
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onCityBankChange={updateCityAndBank} // Pass the update function to LocationModal
      />
    </div>
  );
};

export default Navbar;
