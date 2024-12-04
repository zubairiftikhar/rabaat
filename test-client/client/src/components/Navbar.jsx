import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";
import rabaat_logo from "../assets/img/landing/Rabaat_logo.svg";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
            <span className="navbar-text ms-3">{loggedInUser}</span>
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
        type={modalType}
        handleSuccess={(userName) => setLoggedInUser(userName)}
      />
    </div>
  );
};

export default Navbar;
