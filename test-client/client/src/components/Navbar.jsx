// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '../css/navbar.css';
import rabaat_logo from '../assets/img/landing/Rabaat_logo.svg';

const Navbar = () => {
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
          <ul className="navbar-nav ms-auto"> {/* 'ms-auto' pushes the content to the right */}
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
          <button className="btn rabaat_login_btn ms-3" type="submit">
            Log in
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
