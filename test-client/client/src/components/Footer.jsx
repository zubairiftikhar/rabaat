// src/components/Footer.jsx
import React from "react";
import '../css/navbar.css'

import BackgroundImage from '../../public/assets/img/landing/load_rabbit.gif';
import Footer_logo from '../../public/assets/img/landing/rabaat_f_logo.png'
import { FaEnvelope, FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      {/*Start  Footer */}
      <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left d-flex">
          <img src={Footer_logo} alt="Rabaat Logo" className="footer-logo" />
          <p className="footer-text">
            Where Quality Meets Affordable Prices Every Day. Effortlessly Discover
            Discounts, Match Your Cards, and Maximize Your Savings Today.
          </p>
        </div>

        {/* Center Section */}
        
        <div className="footer-center">
          <ul className="footer-links"> 
            <li><a href="">ABOUT US</a></li>
            <li><a href="https://blog.rabaat.com/" target="blank">BLOGS</a></li>
            <li><a href="">CONTACT US</a></li>
            <li><a href="">TERMS OF USE</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-right">
          <img src={BackgroundImage} alt="Rabbit" className="footer-rabbit" />
          <div className="footer-icons">
            <a href="mailto:contact@rabaat.com" target="blank"><FaEnvelope /></a>
            <a href="https://www.instagram.com/rabaat.official/" target="blank"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61568516926240&mibextid=ZbWKwL" target="blank"><FaFacebook /></a>
            <a href="https://www.tiktok.com/@rabaat_?lang=en" target="blank"><FaTiktok /></a>
            <a href="https://www.youtube.com/channel/UCRUtT9LOT1XbPafRYx714pg" target="blank"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </footer>

      {/* Footer */}
    </>
  );
};

export default Footer;
