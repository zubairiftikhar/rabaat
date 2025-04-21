import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMerchantsByCityBankAndCard,
  fetchMaximumDiscountAnyBank,
} from "../services/api";
import MerchantBankCard from "../components/MerchantBankCard";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";
import { Helmet } from "react-helmet";
import SkeletonMerchantCard from "../components/SkeletonMerchantCard";

const ROW_SIZE = 6;

const MerchantsByBankAndCard = () => {
  const { cityName, bankName, cardName } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleMerchants, setVisibleMerchants] = useState(ROW_SIZE * 3);
  const scrollRef = useRef(null);
  
  // New refs for manual scrolling functionality
  const isScrolling = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cityName) {
      const getMerchants = async () => {
        setLoading(true);
        try {
          const data = await fetchMerchantsByCityBankAndCard(cityName, replaceUnderscoreWithSpaces(bankName), replaceUnderscoreWithSpaces(cardName));
          if (!data || !data.merchants) {
            setLoading(false);
            return;
          }

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

          setMerchants(merchantsWithDiscounts);
          setFilteredMerchants(merchantsWithDiscounts);

          const uniqueCategories = [
            ...new Set(merchantsWithDiscounts.map((m) => m.category)),
          ];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error("Error fetching merchants:", error);
        }

        setLoading(false);
      };
      getMerchants();
    }
  }, [cityName, bankName, cardName]);

  useEffect(() => {
    let filtered = merchants;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (merchant) => merchant.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((merchant) =>
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMerchants(filtered);
    setVisibleMerchants(ROW_SIZE * 3);
  }, [selectedCategory, searchQuery, merchants]);

  // Add horizontal scrolling event handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    
    isScrolling.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    
    // Add cursor styling to indicate grabbing
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const handleMouseUp = () => {
    if (!scrollRef.current) return;
    
    isScrolling.current = false;
    
    // Reset cursor styling
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = '';
  };

  const handleMouseMove = (e) => {
    if (!isScrolling.current || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseLeave = () => {
    if (isScrolling.current) {
      handleMouseUp();
    }
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e) => {
    if (!scrollRef.current) return;
    
    isScrolling.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isScrolling.current || !scrollRef.current) return;
    
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isScrolling.current = false;
  };

  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleMerchants((prev) => prev + ROW_SIZE * 2);
      setLoadingMore(false);
    }, 1000);
  };

  // Add CSS directly in the component for scrollable functionality
  const scrollerStyle = {
    cursor: 'grab',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    whiteSpace: 'nowrap',
    WebkitOverflowScrolling: 'touch',  // For smoother scrolling on iOS
    msOverflowStyle: 'none',  // Hide scrollbar in IE/Edge
    scrollbarWidth: 'none',   // Hide scrollbar in Firefox
  };

  return (
    <>
      <Breadcrumbs />
      <Helmet>
        <title>{`Top Deals & Discounts in ${cityName} | Rabaat`}</title>
        <meta
          name="description"
          content={`Discover the best offers, promotions, and exclusive discounts in ${cityName} on Rabaat.`}
        />
        <meta name="keywords" content="React, SEO, React Helmet" />
      </Helmet>
      <div className="container">
        <h1 className="main_heading">Shops in {cityName}</h1>

        {/* Category Scroller */}
        <div className="category-scroller-wrapper">
          <div className="static-all-button">
            <button
              className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
          </div>
          <div 
            className="category-scroller" 
            ref={scrollRef}
            style={scrollerStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {categories.map((category, index) => (
              <button
                key={index}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="d-flex pt-4 pb-4 page_search">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search Merchant Here..."
              style={{ border: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="row">
            {Array.from({ length: ROW_SIZE * 3 }).map((_, index) => (
              <div key={index} className="col-lg-2 col-md-4 col-6 pb-5">
                <SkeletonMerchantCard />
              </div>
            ))}
          </div>
        ) : filteredMerchants.length > 0 ? (
          <>
            <div className="row shopcontainerw85">
              {filteredMerchants.slice(0, visibleMerchants).map((merchant) => (
                <div
                  key={merchant.id}
                  className="col-lg-2 col-md-3 col-6 merchant-card-spacing"
                >
                  <MerchantBankCard
                    cityName={cityName}
                    bankName={replaceUnderscoreWithSpaces(bankName)}
                    cardName={replaceUnderscoreWithSpaces(cardName)}
                    merchant={merchant}
                    maxDiscount={merchant.maxDiscount}
                    cardCount={merchant.cardCount}
                  />
                </div>
              ))}
            </div>

            {loadingMore && (
              <div className="row">
                {Array.from({ length: ROW_SIZE * 2 }).map((_, index) => (
                  <div key={index} className="col-lg-2 col-md-4 col-6 pb-5">
                    <SkeletonMerchantCard />
                  </div>
                ))}
              </div>
            )}

            {visibleMerchants < filteredMerchants.length && !loadingMore && (
              <div className="text-center mt-4">
                <button className="see-more-btn" onClick={handleSeeMore}>
                  See More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-5 no-merchants-message">
            <h3>No Merchants Found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Add style to hide scrollbar in Webkit browsers */}
      <style>
        {`
          .category-scroller::-webkit-scrollbar {
            display: none;
          }
          .category-scroller {
            scrollbar-width: none; /* Firefox */
          }
        `}
      </style>
    </>
  );
};

export default MerchantsByBankAndCard;