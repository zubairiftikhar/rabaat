import React from "react";
import Rabbit_about from "../../public/assets/img/landing/about_rabbit.webm";
import About_bg from "../../public/assets/img/landing/about_bg.png";

const AboutUs = () => {
  return <>
    <img className="about_bg"
      src={About_bg} />
    <video autoPlay loop muted className="rabbit_about">
      <source src={Rabbit_about} type="video/mp4"></source>
    </video>
    <div className="container-fluid cont_about">
      <div className="row">
        <div className="col-lg-12 col-sm-12">
          <div className="about_page">
            <h1 className="main_heading py-4">About Rabaat</h1>

            <p><span>Who We Are: </span>We are revolutionizing the way you discover discounts and exclusive deals offered by banks on your favorite brands. Our platform bridges the gap between banks and merchants, providing users with a seamless experience to explore the best offers available on their bank cards.</p>
            <p><span>Our mission: </span>is to empower users by making it easier than ever to maximize their savings. Whether you own a credit card, debit card, or prepaid card, our platform helps you find the right discounts without any hassle.</p>

          </div>
        </div>
      </div>
    </div>
  </>;
};

export default AboutUs;
