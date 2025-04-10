import React, { useEffect } from "react";
// import Rabbit_about from "../../public/assets/img/landing/about_rabbit.webm";
import About_bg from "../../public/assets/img/landing/about_bg.png";
import About1 from "../../public/assets/img/landing/about1.jpg";
import { GrCurrency } from "react-icons/gr";
import { BsBank } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <>
    {/* <img className="about_bg"
      src={About_bg} /> */}
    {/* <video autoPlay loop muted className="rabbit_about">
      <source src={Rabbit_about} type="video/mp4"></source>
    </video> */}
    <div className="container cont_about">
      <div className="row py-5">
        <h1 className="first_main_heading text-center py-4">About Rabaat</h1>
        <div className="col-lg-5 col-sm-12">
          <div className="about_page">
            <img src={About1} alt="" />
          </div>
        </div>
        <div className="col-lg-7 col-sm-12">
          <div className="about_page">
            <h5 className="text-start">Who We Are: </h5>
            <p>We are revolutionizing the way you discover discounts and exclusive deals offered by banks on your favorite brands. Our platform bridges the gap between banks and merchants, providing users with a seamless experience to explore the best offers available on their bank cards.</p>
            <h5>Goals</h5>
            <p>We aim to empower users by making it easier than ever to maximize their savings. Whether you own a credit card, debit card, or prepaid card, our platform helps you find the right discounts without any hassle</p>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="about_cards">
          <GrCurrency className="about_cards_icon"/>
            <h5>Effortless Savings:</h5>
            <p> It can be easily saved by exclusive bank discounts and transactions with brands. Saving a significant cost for daily purchases makes it easy to save money while purchasing</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="about_cards">
          <BsBank className="about_cards_icon"/>
            <h5>Wider Coverage</h5>
            <p>Unlock a wider discount for daily purchase, service, dining, travel, hotel and health care. Enjoy savings in various sectors and make daily costs cheaper.</p>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="about_cards">
          <FaRegUser className="about_cards_icon" />
            <h5>Built for Everyone</h5>
            <p>Rabaat provides exclusive bank offers on all services that everyone can use, regardless of age or circumstances and gender. Enjoy discounts in all categories for everyone</p>
          </div>
        </div>
      </div>
    </div>
    <div className="about_gradient">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h5 style={{color: "#fff"}}>Lorem ipsum dolor sit amet consectetur</h5>
        </div>
      </div>
    </div>
    </div>
  </>;
};

export default AboutUs;
