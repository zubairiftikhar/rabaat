// src/components/Footer.jsx
import React from "react";
import '../css/navbar.css'
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import BackgroundImage from '../../public/assets/img/landing/rabaat_footer.jpg';
import Footer_logo from '../../public/assets/img/landing/rabaat_footer_logo.png'

const Footer = () => {
  return (
    <>
        {/* Footer */}
        <footer
          className="text-white pt-5"
        >
          {/* Grid container */}
          <div className="container-fluid footer_bg_style"  style={{ backgroundImage: `url(${BackgroundImage})` }}>
            {/* Section: Links */}
              {/* Grid row */}
              <div className="row text-center footer_row">
                {/* Grid column */}
                <div className="col-lg-2 col-md-12">
                  <div className="footer_logo">
                    <img src={Footer_logo} alt="" />
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 mb-auto mt-auto">
                  <h6 className="text-uppercase font-weight-bold footer_links">
                    <a href="#!" className="text-white">
                      About us
                    </a>
                    <a href="#!" className="text-white">
                      TERMS OF USE
                    </a>
                    <a href="#!" className="text-white">
                      CONTACT US
                    </a>
                    <a href="#!" className="text-white">
                      BLOGS
                    </a>
                  </h6>
                  {/* Section: Social */}
                  <section className="text-center my-3">
                    <a href="#!" className="text-white me-4">
                      <FaFacebook className="footer_icons" />
                    </a>
                    <a href="#!" className="text-white me-4">
                      <FaSquareInstagram className="footer_icons" />
                    </a>
                    <a href="#!" className="text-white me-4">
                      <FaTiktok className="footer_icons" />
                    </a>
                    <a href="#!" className="text-white me-4">
                      <FaYoutube className="footer_icons" />
                    </a>
                    <a href="#!" className="text-white me-4">
                      <IoLogoWhatsapp className="footer_icons" />
                    </a>
                  </section>
                  {/* Section: Social */}
                </div>
                <div className="col-lg-6"></div>
                {/* Grid column */}
              </div>
              {/* Grid row */}
            {/* Section: Links */}
          </div>
          {/* Grid container */}

          {/* Copyright
          <div
            className="text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2020 Copyright:{" "}
            <a className="text-white" href="https://mdbootstrap.com/">
              MDBootstrap.com
            </a>
          </div>
          Copyright */}
        </footer>
        {/* Footer */}
    </>
  );
};

export default Footer;
