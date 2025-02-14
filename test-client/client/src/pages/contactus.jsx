import React from "react";
import "./stylepages.css";
import { FaEnvelope, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";


const ContactUs = () => {
  return <>
    <div className="contact-page">
      <div className="overlay"></div>
      <div className="contact-container">
        {/* Email Section */}
        <div className="contact-card">
          <div className="mb-auto">

            <h2>Get in Touch</h2>
            <a href="mailto:contact@rabaat.com">
              <button className="mt-4 btn rabaat_login_btn">
                <span>
                  <FaEnvelope style={{ fontSize: '18px', marginRight: '5px' }} /> Email Us
                </span>
              </button>
            </a>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="contact-card">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.instagram.com/rabaat.official/" target="blank"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=61568516926240&mibextid=ZbWKwL" target="blank"><FaFacebook /></a>
            <a href="https://www.tiktok.com/@rabaat_?lang=en" target="blank"><FaTiktok /></a>
            <a href="https://www.youtube.com/channel/UCRUtT9LOT1XbPafRYx714pg" target="blank"><FaYoutube /></a>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="contact-card">
          <h2>Scan QR Code</h2>
          <img src={"../../public/assets/img/landing/rabaatqr.png"} alt="QR Code" className="qr-code" />
        </div>
      </div>
    </div>

  </>;
};

export default ContactUs;
