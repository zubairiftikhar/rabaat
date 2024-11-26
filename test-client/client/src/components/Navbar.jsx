// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Rabaat
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            {" "}
            <Link className="nav-link" to="/banks">
              Banks
            </Link>{" "}
          </li>{" "}
          <li className="nav-item">
            {" "}
            <Link className="nav-link" to="/merchants">
              Merchants
            </Link>{" "}
          </li>{" "}
          <li className="nav-item">
            {" "}
            <Link className="nav-link" to="/deals">
              Deals
            </Link>{" "}
          </li>{" "}
        </ul>{" "}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
