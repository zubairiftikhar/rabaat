import React from "react";
import SearchCard from '../../assets/img/landing/main_search_card.png'
import SearchShop from '../../assets/img/landing/main_search_shop.png'
import "./mainsecsearch.css";
import { BiSearch } from "react-icons/bi";


const Mainsecsearch = () => {
    return (
        <div className="hero-section text-white d-flex align-items-center">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-md-12 col-sm-12">
                        <h3 className="mb-3">
                            Unlock Big <span className="highlight">Savings</span>
                        </h3>
                        <h3 className="mb-4">Your Go-To Destination for Discounted Cards</h3>
                        <div className="search-bar mb-3">
                            <BiSearch className="mainsearchicon" />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ask me anything"
                            />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12 col-sm-12">
                        <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-light btn-lg ms-5">
                                <BiSearch /> Search By Card <img src={SearchCard} alt="" />
                            </button>
                            <button className="btn btn-light btn-lg">
                                <BiSearch /> Search By Shop <img src={SearchShop} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mainsecsearch;