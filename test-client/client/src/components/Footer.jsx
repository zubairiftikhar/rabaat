import React from "react";
import "../css/navbar.css"; // Import CSS for styling
import { useNavigate } from "react-router-dom";
import Footercard from '../../public/assets/img/landing/footercard.png'
import Footerlogo from '../../public/assets/img/landing/rabaat_f_logo.png'
import { FaTiktok , FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
const handleAboutUs = () => {
  navigate(`/AboutUs`);
};
const handleContact = () => {
  navigate(`/Contact`);
};
const handleTermOfUse = () => {
  navigate(`/TermOfUse`);
};
  return (
    <footer className="footer">
      <div className="footer-content">
        <h1>About Rabaat</h1>
        <p style={{ color: "#fff", padding: "20px 0" }}>
          Where Quality Meets Affordable Prices Every Day. Effortlessly Discover Discounts,
          Match Your Cards, and Maximize Your Savings Today.
        </p>
      </div>
      <div className="footer_bottom">
        <div className="footer-logo">
          <img src={Footerlogo} alt="Logo" />
        </div>
        <div className="footer-links">
          <a href="#">Blog</a>
          <a onClick={handleAboutUs}>About Us</a>
          <a onClick={handleContact}>Contact Us</a>
          <a onClick={handleTermOfUse}>Terms of Use</a>
        </div>

        <div className="footer-social">
        <a href="https://www.tiktok.com/@rabaat_?lang=en" target="blank"><FaTiktok /></a>
          <a href="https://www.facebook.com/profile.php?id=61568516926240&mibextid=ZbWKwL" target="blank"><FaFacebookF /></a>
          <a href="https://www.instagram.com/rabaat.official/" target="blank"><FaInstagram /></a>
          <a href="https://www.youtube.com/channel/UCRUtT9LOT1XbPafRYx714pg" target="blank"><FaYoutube /></a>
        </div>

      </div>

      <div className="credit-card">
        <img src={Footercard} alt="Credit Cards" />
      </div>
    </footer>
  );
};

export default Footer;



// const navigate = useNavigate();
// const handleAboutUs = () => {
//   navigate(`/AboutUs`);
// };
// const handleContact = () => {
//   navigate(`/Contact`);
// };
// const handleTermOfUse = () => {
//   navigate(`/TermOfUse`);
// };

// import { useNavigate } from "react-router-dom";
