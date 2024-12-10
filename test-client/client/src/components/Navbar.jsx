import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation to detect page navigation
import { FaUserCircle } from "react-icons/fa"; // Import user icon from react-icons
import AuthModal from "./AuthModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../assets/img/landing/Rabaat_logo.svg";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import CityModal from "./CityModal"; // Import CityModal component for city selection

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentCity, setCurrentCity] = useState(null); // State for selected city
  const [showCityModal, setShowCityModal] = useState(false); // State to show/hide city modal
  const location = useLocation(); // Hook to get current page location

  // Check for logged-in user and selected city when the component mounts
  useEffect(() => {
    const user = Cookies.get("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }

    // Check for selected city in sessionStorage
    const cityName = sessionStorage.getItem("selectedCityName");
    if (cityName) {
      setCurrentCity(cityName);
    }
  }, []);

  // Update the city when navigating to the banks page
  useEffect(() => {
    if (location.pathname.startsWith("/banks")) {
      const cityName = sessionStorage.getItem("selectedCityName");
      if (cityName) {
        setCurrentCity(cityName);
      } else {
        setShowCityModal(true); // Show the modal if no city is selected
      }
    }
  }, [location]);

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleLogout = () => {
    Cookies.remove("loggedInUser");
    setLoggedInUser(null);
  };

  const handleSuccess = (userName) => {
    setLoggedInUser(userName);
    Cookies.set("loggedInUser", userName, { expires: 7 });
  };

  const handleCitySelect = (city) => {
    setCurrentCity(city.name); // Update the city in the state
    sessionStorage.setItem("selectedCityName", city.name); // Store selected city in session
    setShowCityModal(false); // Close modal after selection
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
              <Link className="nav-link" to="/banks">
                Banks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/merchants">
                Merchants
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/deals">
                Deals
              </Link>
            </li>
          </ul>
          <div className="navbar-text ms-3 d-flex align-items-center text-white">
            <button
              className="btn btn-outline-light me-3"
              onClick={() => setShowCityModal(true)}
            >
              {currentCity ? `City: ${currentCity}` : "Select City"}
            </button>
            {loggedInUser ? (
              <>
                <FaUserCircle className="me-2" size={20} />
                <span>{loggedInUser}</span>
                <button className="btn btn-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn rabaat_login_btn ms-3"
                onClick={() => handleShowModal("login")}
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSuccess={handleSuccess}
        initialType={modalType}
      />
      <CityModal
        show={showCityModal}
        onSelectCity={handleCitySelect}
        onClose={() => setShowCityModal(false)}
      />
    </div>
  );
};

export default Navbar;
