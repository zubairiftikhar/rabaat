import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchMerchantsByCity } from "../services/api"; // Updated to fetch merchants by city only
import MerchantCard from "../components/MerchantCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import search and arrow icons
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";

const Merchants = () => {
  const { cityId } = useParams(); // Only cityId is now used
  const [merchants, setMerchants] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null); // Ref for category slider

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByCity(cityId); // Updated API call
        setMerchants(data.merchants);

        const uniqueCategories = [
          "All",
          ...new Set(data.merchants.map((merchant) => merchant.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    getMerchants();
  }, [cityId]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleRows((prevRows) => prevRows + 2);
      setLoadingMore(false);
    }, 1000);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setVisibleRows(2);
  };

  const handleSliderScroll = (direction) => {
    const scrollAmount = 400; // Pixels to scroll per click
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch = merchant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || merchant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const merchantsToShow = filteredMerchants.slice(0, visibleRows * 6);
  const isLoadMoreDisabled = merchantsToShow.length >= filteredMerchants.length;

  return (
    <>
      
      <div className="bg_img_search_container">
        <img
          src={`/src/assets/img/banks/${bank.image}`}
          alt={bank.name}
          className="dynamic-image"
        />

        {/* Search Bar */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>
      <Breadcrumbs />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Merchants in City {cityId}</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY MERCHANTS</span>
              <span className="line"></span>
            </div>

            {/* Category Slider with Arrow Buttons placed above search filter */}
            <div className="d-flex align-items-center mb-4">
              <button
                className="arrow-btn"
                onClick={() => handleSliderScroll("left")}
              >
                <FaChevronLeft />
              </button>
              <div
                className="category-slider d-flex overflow-hidden px-3"
                ref={sliderRef}
              >
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`category-btn ${selectedCategory === category ? "active" : ""
                      }`}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                className="arrow-btn"
                onClick={() => handleSliderScroll("right")}
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Search Input with Icon */}
            <div className="d-flex pt-5 pb-5 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Merchant Here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {merchantsToShow.length > 0 ? (
            merchantsToShow.map((merchant, index) => (
              <div
                className={`col-md-2 col-sm-12 fade-in ${
                  loadingMore ? "loading" : ""
                }`}
                key={merchant.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MerchantCard
                  cityId={cityId} // City ID is passed to the MerchantCard
                  merchant={merchant}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center mt-5 no-merchants-message">
              <h3 className="no-merchants-title">Sorry, No Merchants Found</h3>
              <p className="no-merchants-description">
                We couldn't find any merchants matching your search criteria.
                Please try adjusting the search or choose a different category.
              </p>
            </div>
          )}
        </div>
        {filteredMerchants.length > merchantsToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={loadMore}
              disabled={isLoadMoreDisabled}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Merchants;
