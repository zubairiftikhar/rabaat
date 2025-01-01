import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { fetchMerchantsByCity, fetchCityById } from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";

const Merchants = () => {
  const [cityId, setCityId] = useState(null);
  const [city, setCity] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null);
  const location = useLocation();
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityIdFromQuery = queryParams.get("CityID");
    setCityId(cityIdFromQuery);
  }, [location]);

  useEffect(() => {
    const getCity = async () => {
      try {
        const city = await fetchCityById(cityId);
        setCity(city);
      } catch (error) {
        console.error("Error fetching city:", error);
      }
    };
    getCity();
  }, [cityId]);

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByCity(cityId);
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
    stopAutoScroll();
  };

  const handleSliderScroll = (direction) => {
    const slider = sliderRef.current;
    const scrollAmount = slider.offsetWidth / 2;

    if (direction === "left") {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else {
      slider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
    stopAutoScroll();
  };

  const startAutoScroll = () => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = setInterval(() => {
      const slider = sliderRef.current;
      const maxScrollLeft = slider.scrollWidth - slider.offsetWidth;

      if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += 1; // Adjust this value to control speed
      }
    }, 20); // Adjust interval time for smoothness
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = null;
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

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
      <Breadcrumbs />
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading">Merchants in {city.name}</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY MERCHANTS</span>
              <span className="line"></span>
            </div>

            {/* Category Slider */}
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
                style={{ whiteSpace: "nowrap", overflowX: "auto" }}
              >
                <button
                  className={`category-btn ${
                    selectedCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryFilter("All")}
                >
                  All
                </button>
                {categories
                  .filter((category) => category !== "All")
                  .map((category, index) => (
                    <button
                      key={index}
                      className={`category-btn ${
                        selectedCategory === category ? "active" : ""
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

            {/* Search Input */}
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
                <MerchantCard cityId={cityId} merchant={merchant} />
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
