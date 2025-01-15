import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../../public/assets/img/landing/Rabaat_logo.svg";
import Cookies from "js-cookie";
import City from "../../public/assets/img/landing/city.png";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch.jsx";
import { IoMdArrowDropdown } from "react-icons/io";

const Navbar = ({ selectedCity, onLocationChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Update state when the city changes
  const updateCity = (cityName) => {
    setCurrentCity(cityName);
    Cookies.set("selectedCityName", cityName);
  };

  // Handle successful login
  const handleSuccess = (userName) => {
    setLoggedInUser(userName);
    Cookies.set("loggedInUser", userName, { expires: 7 }); // Store in cookies
  };

  useEffect(() => {
    const user = Cookies.get("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }

    const cityName = Cookies.get("selectedCityName");
    setCurrentCity(cityName || "Select City");
  }, []);

  const handleLogout = () => {
    Cookies.remove("loggedInUser");
    Cookies.remove("authToken"); // Remove JWT token on logout
    setLoggedInUser(null);
  };

  return (
    <>
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
                <a href="#!" className="nav_links">
                  About us
                </a>
              </li>
              <li className="nav-item">
                <a href="#!" className="nav_links">
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a href="#!" className="nav_links">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light mx-3"
                  onClick={onLocationChange}
                >
                  <img src={City} className="me-1" alt="" />
                  {` ${selectedCity ? selectedCity.name : "Select City"}`}
                  <IoMdArrowDropdown />
                </button>
              </li>
              <li className="nav-item">
                {loggedInUser ? (
                  <>
                    <FaUserCircle
                      className="m-2"
                      size={20}
                      style={{ color: "#fff" }}
                    />
                    <span className="my-2" style={{ color: "#fff" }}>{loggedInUser}</span>
                    <button
                      className="btn rabaat_login_btn ms-3"
                      onClick={handleLogout}
                    >
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="btn rabaat_login_btn ms-3"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <span>Log In</span>
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
          handleSuccess={handleSuccess} // Pass handleSuccess to AuthModal
        />
        <LocationModal
          show={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onCityChange={updateCity}
        />
      </div>
      <Mainsecsearch />
    </>
  );
};

export default Navbar;
