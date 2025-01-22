import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchMerchantsByCity,
  fetchCityById,
  fetchMaximumDiscountAnyBank,
} from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";
import { Helmet } from "react-helmet";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch.jsx";

const Merchants = () => {
  const { cityName } = useParams();
  const [cityId, setCityId] = useState(null);
  const [city, setCity] = useState("");
  const [merchants, setMerchants] = useState([]);
  const [discountedMerchants, setDiscountedMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const sliderRefs = useRef({});
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityIdFromQuery = queryParams.get("CityID");
    setCityId(cityIdFromQuery);
  }, [location]);

  useEffect(() => {
    if (cityId) {
      const getCity = async () => {
        try {
          const city = await fetchCityById(cityId);
          setCity(city);
        } catch (error) {
          console.error("Error fetching city:", error);
        }
      };
      getCity();
    }
  }, [cityId]);

  useEffect(() => {
    if (cityId) {
      const getMerchants = async () => {
        try {
          const data = await fetchMerchantsByCity(cityId);
          setMerchants(data.merchants);

          const uniqueCategories = [
            ...new Set(data.merchants.map((merchant) => merchant.category)),
          ];
          setCategories(uniqueCategories);

          const merchantsWithDiscounts = await Promise.all(
            data.merchants.map(async (merchant) => {
              const discountData = await fetchMaximumDiscountAnyBank(
                merchant.id,
                cityId
              );
              return {
                ...merchant,
                maxDiscount: discountData?.max_discount || 0,
              };
            })
          );

          setDiscountedMerchants(merchantsWithDiscounts);
        } catch (error) {
          console.error("Error fetching merchants:", error);
        }
      };
      getMerchants();
    }
  }, [cityId]);

  const handleSliderScroll = (direction, category) => {
    const slider = sliderRefs.current[category];
    if (!slider) return;

    const scrollAmount = slider.offsetWidth / 2;
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    stopAutoScroll();
  };

  const startAutoScroll = (category) => {
    if (autoScrollInterval.current) return;

    autoScrollInterval.current = setInterval(() => {
      const slider = sliderRefs.current[category];
      if (!slider) return;

      const maxScrollLeft = slider.scrollWidth - slider.offsetWidth;
      if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += 1;
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval.current);
    autoScrollInterval.current = null;
  };

  useEffect(() => {
    startAutoScroll("categories");
    return () => stopAutoScroll();
  }, [categories]);

  const categorizedMerchants = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        merchants: discountedMerchants.filter(
          (merchant) =>
            (category === "All" || merchant.category === category) &&
            merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
        ),
      }))
      .filter(({ merchants }) => merchants.length > 0);
  }, [discountedMerchants, categories, searchQuery, activeCategory]);

  return (
    <>
      <Mainsecsearch />
      <Breadcrumbs />
      <Helmet>
        <title>{`Rabaat | Discover Top Deals & Discounts In ${cityName}`}</title>
        <meta
          name="description"
          content={`Discover the best deals and discounts near you with Rabaat. Save on shopping, dining, and more with exclusive offers in ${cityName}!`}
        />
        <meta name="keywords" content="React, SEO, React Helmet" />
      </Helmet>

      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading">Merchants in {cityName}</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY MERCHANTS</span>
              <span className="line"></span>
            </div>
            <div className="container">
              <div className="d-flex align-items-center">
                <button
                  className="arrow-btn"
                  onClick={() => handleSliderScroll("left", "categories")}
                >
                  <FaChevronLeft />
                </button>

                <div
                  className="category-slider d-flex overflow-hidden px-3"
                  ref={(el) => (sliderRefs.current["categories"] = el)}
                >
                  <button
                    className={`category-btn ${
                      activeCategory === "All" ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory("All")}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`category-btn ${
                        activeCategory === category ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <button
                  className="arrow-btn"
                  onClick={() => handleSliderScroll("right", "categories")}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
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
        {categorizedMerchants.length > 0 ? (
          categorizedMerchants.map(
            ({ category, merchants }) =>
              (activeCategory === "All" || activeCategory === category) && (
                <div key={category} className="category-section">
                  <h2 className="category-heading">{category}</h2>
                  <div className="d-flex align-items-center">
                    <button
                      className="arrow-btn"
                      onClick={() => handleSliderScroll("left", category)}
                    >
                      <FaChevronLeft />
                    </button>

                    <div
                      className="merchant-slider d-flex overflow-hidden px-3"
                      ref={(el) => (sliderRefs.current[category] = el)}
                    >
                      {merchants.map((merchant) => (
                        <div
                          className="col-lg-2 col-md-6 col-sm-12 fade-in merchant-card-spacing"
                          key={merchant.id}
                        >
                          <MerchantCard
                            cityName={cityName}
                            cityId={cityId}
                            merchant={merchant}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      className="arrow-btn"
                      onClick={() => handleSliderScroll("right", category)}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )
          )
        ) : (
          <div className="text-center mt-5 no-merchants-message">
            <h3 className="no-merchants-title">No Merchants Found</h3>
            <p className="no-merchants-description">
              Try selecting a different category or adjusting your search
              criteria.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Merchants;
