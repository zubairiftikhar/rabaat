import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import user icon from react-icons
import AuthModal from "./AuthModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../assets/img/landing/Rabaat_logo.svg";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check if the user is logged in (via cookie) when the component mounts
  useEffect(() => {
    const user = Cookies.get("loggedInUser");
    if (user) {
      setLoggedInUser(user); // Set user from cookie if exists
    }
  }, []);

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleLogout = () => {
    Cookies.remove("loggedInUser"); // Remove cookie on logout
    setLoggedInUser(null); // Reset logged-in state
  };

  const handleSuccess = (userName) => {
    setLoggedInUser(userName);
    Cookies.set("loggedInUser", userName, { expires: 7 }); // Set user cookie for 7 days
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
          {loggedInUser ? (
            <div className="navbar-text ms-3 d-flex align-items-center text-white">
              <FaUserCircle className="me-2" size={20} /> {/* User icon */}
              <span>{loggedInUser}</span>
              <button className="btn btn-danger ms-3" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="btn rabaat_login_btn ms-3"
              onClick={() => handleShowModal("login")}
            >
              Log in
            </button>
          )}
        </div>
      </nav>
      <AuthModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSuccess={handleSuccess}
        initialType={modalType}
      />
    </div>
  );
};

export default Navbar;
