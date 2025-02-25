import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./mainsecsearch.css";
import { BiSearch } from "react-icons/bi";
import { fetchMerchantSearchResults, fetchCityById } from "../../services/api";
import Cookies from "js-cookie";
import Rabaat_shop_img from "../../../public/assets/img/landing/rabaat_shops_icon.png";
import Card_image from "../../../public/assets/img/landing/rabaat_card.png";
import Rabbit from "../../../public/assets/img/landing/rabbit.webm";

const Mainsecsearch = () => {
  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false); // Track if a suggestion was clicked
  const navigate = useNavigate();

  const cityID = Cookies.get("selectedCityId");

  useEffect(() => {
    if (cityID) {
      const getCity = async () => {
        try {
          const city = await fetchCityById(cityID);
          setCity(city);
        } catch (error) {
          console.error("Error fetching city:", error);
        }
      };
      getCity();
    }
  }, [cityID]);

  const backgroundImageUrl = `../public/assets/img/cities/rabaat_city_bg.jpg`;

  useEffect(() => {
    if (clicked) {
      setClicked(false);
      return;
    }

    if (keyword.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await fetchMerchantSearchResults(city.id, keyword);

        // Sort results to prioritize branch name matches
        const sortedData = data.sort((a, b) => {
          const branchMatchA = a.branch_name
            .toLowerCase()
            .includes(keyword.toLowerCase());
          const branchMatchB = b.branch_name
            .toLowerCase()
            .includes(keyword.toLowerCase());
          if (branchMatchA && !branchMatchB) return -1;
          if (!branchMatchA && branchMatchB) return 1;
          return 0;
        });

        setSuggestions(sortedData);
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
  }, [keyword, city.id, clicked]);

  const handleMerchantClick = (merchant) => {
    const { merchant_id, branch_id, merchant_name, branch_address } = merchant;

    // Update search input with the selected merchant name and branch address
    setKeyword(`${merchant_name} - ${branch_address}`);

    // Clear suggestions and set clicked state
    setSuggestions([]);
    setClicked(true);

    // Navigate to the branch details page
    navigate(
      `/${city.name}/${replaceSpacesWithUnderscore(
        merchant_name
      )}/Branch/${branch_id}/${replaceSpacesWithUnderscore(branch_address)}`
    );
  };

  // Function to highlight matching parts of the text
  const highlightMatch = (text, keyword) => {
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="highlight-text">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const cityName = city.name;

  // Navigate to Search-By-Bank page
  const handleSearchWithBankCard = () => {
    navigate(`/${cityName}/Search-By-Bank`);
  };

  return (
    <div
      className="hero-section text-white d-flex align-items-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="container">
        {/* <video autoPlay loop muted className="rabbit rabbit1">
          <source src={Rabbit} type="video/mp4"></source>
        </video> */}
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 text-center">
            <h3 style={{ textShadow: "2px 2px 4px #000000b8" }}>
              Your One-Stop Destination for Discounts & Lifestyle Hacks
            </h3>
            <div className="search_bar">
              <div className="search_container">
                <img
                  src={Rabaat_shop_img}
                  alt="Shop Icon"
                  className="shop-icon"
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Shop / Branch"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <div className="search-button">
                  <BiSearch className="search-icon" />
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleMerchantClick(suggestion)}
                    >
                      {highlightMatch(
                        `${suggestion.merchant_name} - ${suggestion.branch_address}`,
                        keyword
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Button for Search with Bank Card */}
            <div
              className="card_button"
              type="btn"
              onClick={handleSearchWithBankCard}
            >
              <img src={Card_image} alt="" />
              Search by Bank Card
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainsecsearch;
