import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchCard from "../../assets/img/landing/main_search_card.png";
import SearchShop from "../../assets/img/landing/main_search_shop.png";
import "./mainsecsearch.css";
import { BiSearch } from "react-icons/bi";
import { fetchMerchantSearchResults, fetchCityById } from "../../services/api";
import Cookies from "js-cookie";

const Mainsecsearch = () => {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cityID = Cookies.get("selectedCityId");

  useEffect(() => {
    const getCity = async () => {
      try {
        const city = await fetchCityById(cityID);
        setCity(city);
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };
    getCity();
  }, [cityID]);

  const backgroundImageUrl = `../src/assets/img/cities/${city.image}`;

  useEffect(() => {
    if (keyword.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await fetchMerchantSearchResults(city.id, keyword);
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [keyword, city.id]);

  const handleMerchantClick = (Merchant_ID) => {
    navigate(`/branch-details/${Merchant_ID}/${city.id}`);
  };

  return (
    <div
      className="hero-section text-white d-flex align-items-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-12 col-sm-12">
            <h3
              className="mb-3"
              style={{ textShadow: "2px 2px 4px #000000b8" }}
            >
              Unlock Big <span className="highlight">Savings</span>
            </h3>
            <h3
              className="mb-4"
              style={{ textShadow: "2px 2px 4px #000000b8" }}
            >
              Your Go-To Destination for Discounted Cards
            </h3>
            <div className="search-bar mb-3">
              <BiSearch className="mainsearchicon" />
              <input
                type="text"
                className="form-control"
                placeholder="Ask me anything"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {loading && <div className="loader">Loading...</div>}
              {suggestions.length > 0 ? (
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() =>
                        handleMerchantClick(suggestion.merchant_id)
                      }
                    >
                      {suggestion.merchant_name} - {suggestion.branch_address}
                    </div>
                  ))}
                </div>
              ) : keyword.trim() !== "" && !loading ? (
                <div className="no-results">No results found</div>
              ) : null}
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
