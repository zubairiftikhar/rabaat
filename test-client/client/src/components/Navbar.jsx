import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import AuthModal from "./AuthModal";
import LocationModal from "./LocationModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../../public/assets/img/landing/rabaat_logo.png";
import Cookies from "js-cookie";
import City from "../../public/assets/img/landing/city.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { fetchMerchantSearchResults } from "../services/api.js";

const Navbar = ({ selectedCity, onLocationChange }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false); // State for tracking toggle button

  const location = useLocation();
  const navigate = useNavigate();
  const cityID = Cookies.get("selectedCityId");
  const updateCity = (cityName) => {
    setCurrentCity(cityName);
    Cookies.set("selectedCityName", cityName);
  };

  const handleSuccess = (userName) => {
    setLoggedInUser(userName);
    Cookies.set("loggedInUser", userName, { expires: 7 });
  };
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isToggled && !event.target.closest(".navbar")) {
        setIsToggled(false);
      }
    };
  
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isToggled]);
  

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
    Cookies.remove("authToken");
    setLoggedInUser(null);
  };

  const isCityPage = /^\/[a-zA-Z]+$/.test(location.pathname);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await fetchMerchantSearchResults(cityID, searchQuery);
        const sortedData = data.sort((a, b) => {
          const branchMatchA = a.branch_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const branchMatchB = b.branch_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          if (branchMatchA && !branchMatchB) return -1;
          if (!branchMatchA && branchMatchB) return 1;
          return 0;
        });
        setSuggestions(sortedData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleMerchantClick = (merchant) => {
    const { merchant_id, branch_id, merchant_name, branch_address } = merchant;

    setSearchQuery(`${merchant_name} - ${branch_address}`);
    setSuggestions([]);

    navigate(
      `/${currentCity}/${merchant_name.replace(
        /\s+/g,
        "_"
      )}/Branch/${branch_id}/${branch_address.replace(/\s+/g, "_")}`
    );
  };

  const highlightMatch = (text, keyword) => {
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight-text">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleAboutUs = () => {
    navigate(`/AboutUs`);
  };
  const handleContact = () => {
    navigate(`/Contact`);
  };

  // Toggle button handler
  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <>
      <div className="container-fluid rabaat_nav_bg">
        <nav className="navbar navbar-expand-lg">
          <Link className="navbar-brand" to="/">
            <img src={rabaat_logo} alt="Rabaat" style={{ width: "62px" }} />
          </Link>
          {!isCityPage && (
            <div className="search-bar">
              <BiSearch className="mainsearchicon" />
              <input
                type="text"
                className="top_form-control"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {suggestions.length > 0 ? (
                <div className="top_suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleMerchantClick(suggestion)}
                    >
                      {highlightMatch(
                        `${suggestion.merchant_name} - ${suggestion.branch_address}`,
                        searchQuery
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          <button
            className={`navbar-toggler ${isToggled ? "open" : ""}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isToggled ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isToggled ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav_links" to="/" onClick={() => setIsToggled(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav_links" onClick={() => { handleAboutUs(); setIsToggled(false); }}>
                  About us
                </a>
              </li>
              <li className="nav-item">
                <a href="https://blog.rabaat.com/" target="blank" className="nav_links" onClick={() => setIsToggled(false)}>
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a className="nav_links" onClick={() => { handleContact(); setIsToggled(false); }}>
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
                    <span className="my-2" style={{ color: "#fff" }}>
                      {loggedInUser}
                    </span>
                    <button
                      className="btn rabaat_login_btn mx-3"
                      onClick={handleLogout}
                    >
                      <span>Log Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="btn rabaat_login_btn mx-3"
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
          handleSuccess={handleSuccess}
        />
        <LocationModal
          show={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onCityChange={updateCity}
        />
      </div>
    </>
  );
};

export default Navbar;
