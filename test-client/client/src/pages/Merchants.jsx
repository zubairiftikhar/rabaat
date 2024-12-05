import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchMerchantsByBankAndCity } from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import search and arrow icons
import "../css/cityload.css";

const Merchants = () => {
  const { bankId, cityId } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [bank, setBank] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null); // Ref for category slider

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByBankAndCity(bankId, cityId);
        setBank(data.bank);
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
  }, [bankId, cityId]);

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
      <img
        src={`/src/assets/img/banks/${bank.image}`}
        alt={bank.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Merchants in {bank.name}</h1>
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
          {merchantsToShow.map((merchant, index) => (
            <div
              className={`col-md-2 fade-in ${loadingMore ? "loading" : ""}`}
              key={merchant.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MerchantCard
                bankId={bankId}
                cityId={cityId}
                merchant={merchant}
              />
            </div>
          ))}
        </div>
        {filteredMerchants.length > merchantsToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
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
