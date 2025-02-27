import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  fetchMerchantsByCity,
  fetchMaximumDiscountAnyBank,
} from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";
import { Helmet } from "react-helmet";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch.jsx";
import SkeletonMerchantCard from "../components/SkeletonMerchantCard";

const Merchants = () => {
  const { cityName } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [discountedMerchants, setDiscountedMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const sliderRefs = useRef({});
  const autoScrollInterval = useRef(null);
  const [loading, setLoading] = useState(true);

  // Handle Touch Control Start
  const handlePointerDown = (event, category) => {
    if (!sliderRefs.current[category]) return;

    let slider = sliderRefs.current[category];

    slider.isDragging = true;
    slider.startX = event.pageX;
    slider.scrollLeftStart = slider.scrollLeft;
    slider.velocity = 0;
    slider.lastMoveTime = Date.now();

    // Stop any existing momentum scroll
    cancelAnimationFrame(slider.momentumFrame);
  };

  const handlePointerMove = (event, category) => {
    let slider = sliderRefs.current[category];
    if (!slider || !slider.isDragging) return;

    let deltaX = event.pageX - slider.startX;
    slider.scrollLeft = slider.scrollLeftStart - deltaX;

    // Calculate velocity for smooth deceleration
    let now = Date.now();
    let timeDiff = now - slider.lastMoveTime;
    slider.velocity = deltaX / (timeDiff || 1);

    // Update for next frame
    slider.lastMoveTime = now;
  };

  const handlePointerUp = (category) => {
    let slider = sliderRefs.current[category];
    if (!slider) return;

    slider.isDragging = false;

    let velocity = slider.velocity * 50; // Adjust for smooth inertia
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    const applyMomentum = () => {
      if (!slider) return;

      slider.scrollLeft -= velocity;
      velocity *= 0.95; // Deceleration

      // Prevent overshooting
      if (slider.scrollLeft <= 0) {
        slider.scrollLeft = 0;
        return;
      }
      if (slider.scrollLeft >= maxScrollLeft) {
        slider.scrollLeft = maxScrollLeft;
        return;
      }

      if (Math.abs(velocity) > 1) {
        slider.momentumFrame = requestAnimationFrame(applyMomentum);
      }
    };

    requestAnimationFrame(applyMomentum);
  };

  // Handle Touch Control Ends

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cityName) {
      setLoading(true);
      const getMerchants = async () => {
        try {
          const data = await fetchMerchantsByCity(cityName);
          setMerchants(data.merchants);

          const uniqueCategories = [
            ...new Set(data.merchants.map((merchant) => merchant.category)),
          ];
          setCategories(uniqueCategories);

          const merchantsWithDiscounts = await Promise.all(
            data.merchants.map(async (merchant) => {
              const discountData = await fetchMaximumDiscountAnyBank(
                merchant.name,
                cityName
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
        } finally {
          setLoading(false);
        }
      };
      getMerchants();
    }
  }, [cityName]);

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

  const categoryScrollerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Auto-scroll categories
  useEffect(() => {
    const startAutoScroll = () => {
      if (categoryScrollerRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          categoryScrollerRef.current.scrollLeft += 3; // Adjust speed here
        }, 60);
      }
    };

    startAutoScroll();

    return () => clearInterval(scrollIntervalRef.current);
  }, []);

  const stopAutoScroll = () => {
    clearInterval(scrollIntervalRef.current);
  };

  const navigate = useNavigate();
  return (
    <>
      <Mainsecsearch />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 pt-5">
            <div className="switch-buttons">
              <button
                type="button"
                className={`switch-btn ${
                  location.pathname.includes("Bank") ? "" : "active"
                }`}
                onClick={() => navigate(`/${cityName}`)}
              >
                Merchants
              </button>
              <button
                type="button"
                className={`switch-btn ${
                  location.pathname.includes("Bank") ? "active" : ""
                }`}
                onClick={() => navigate(`/${cityName}/Bank`)}
              >
                Banks
              </button>
              <div
                className={`switch-slider ${
                  location.pathname.includes("Bank") ? "move-right" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
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
              <div className="category-scroller-container">
                <button
                  className="scroller-arrow left"
                  onClick={() => {
                    categoryScrollerRef.current.scrollLeft -= 100;
                    stopAutoScroll();
                  }}
                >
                  <FaChevronLeft />
                </button>

                <div
                  className="category-scroller"
                  ref={categoryScrollerRef}
                  onMouseEnter={stopAutoScroll}
                  onMouseLeave={() => {
                    stopAutoScroll();
                    scrollIntervalRef.current = setInterval(() => {
                      categoryScrollerRef.current.scrollLeft += 1;
                    }, 50);
                  }}
                >
                  <button
                    className={`category-btn ${
                      activeCategory === "All" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveCategory("All");
                      stopAutoScroll();
                    }}
                  >
                    All
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`category-btn ${
                        activeCategory === category ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveCategory(category);
                        stopAutoScroll();
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <button
                  className="scroller-arrow right"
                  onClick={() => {
                    categoryScrollerRef.current.scrollLeft += 100;
                    stopAutoScroll();
                  }}
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
        {loading ? (
          <div className="row">
            {[...Array(18)].map((_, index) => (
              <div key={index} className="col-lg-2 col-md-6 col-sm-12 mb-5">
                <SkeletonMerchantCard />
              </div>
            ))}
          </div>
        ) : categorizedMerchants.length > 0 ? (
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
                      className="category-slider"
                      ref={(el) => (sliderRefs.current["categories"] = el)}
                      onPointerDown={(e) => handlePointerDown(e, "categories")}
                      onPointerMove={(e) => handlePointerMove(e, "categories")}
                      onPointerUp={() => handlePointerUp("categories")}
                      onPointerLeave={() => handlePointerUp("categories")} // Stop drag when pointer leaves
                      style={{
                        cursor: "grab",
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                      }}
                    >
                      {merchants.map((merchant) => (
                        <div
                          className="col-lg-2 col-md-6 col-sm-12 fade-in merchant-card-spacing"
                          key={merchant.id}
                        >
                          <MerchantCard
                            cityName={cityName}
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
