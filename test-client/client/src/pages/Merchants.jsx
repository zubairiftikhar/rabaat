import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMerchantsByCity,
  fetchMaximumDiscountAnyBank,
  fetchCategories
} from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch } from "react-icons/fa";
import "../css/cityload.css";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/merchanterrormsg.css";
import { Helmet } from "react-helmet";
import SkeletonMerchantCard from "../components/SkeletonMerchantCard";

const ROW_SIZE = 6;

// Create a session storage key for this component's state
const getSessionKey = (cityName) => `merchantsPageState_${cityName}`;

const Merchants = () => {
  const { cityName, categoryName } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleMerchants, setVisibleMerchants] = useState(ROW_SIZE * 3);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const pageFullyLoaded = useRef(false);
  const scrollPositionRef = useRef(0);
  
  // New refs for manual scrolling functionality
  const isScrolling = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  // On mount, try to restore previous state - but not search query
  useEffect(() => {
    const restoreStateFromSession = () => {
      try {
        const savedState = sessionStorage.getItem(getSessionKey(cityName));
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Removed searchQuery restoration
          setSelectedCategory(parsedState.selectedCategory || "All");
          setVisibleMerchants(parsedState.visibleMerchants || ROW_SIZE * 3);
          // We'll handle scrollPosition separately after data loads
          scrollPositionRef.current = parsedState.scrollPosition || 0;
        }
      } catch (error) {
        console.error("Error restoring state:", error);
      }
    };

    restoreStateFromSession();
  }, [cityName]);

  // Save state when component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      const stateToSave = {
        // Still saving searchQuery, but not restoring it on load
        searchQuery,
        selectedCategory,
        visibleMerchants,
        scrollPosition: window.scrollY,
      };
      sessionStorage.setItem(getSessionKey(cityName), JSON.stringify(stateToSave));
    };

    // Listen for page navigation/unload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Also save state when navigating with React Router
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [cityName, searchQuery, selectedCategory, visibleMerchants]);

  // Fetch all categories separately
  useEffect(() => {
    const getAllCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesData = await fetchCategories();
        if (categoriesData && Array.isArray(categoriesData)) {
          // Extract category names from the response
          const categoryNames = categoriesData.map(cat => cat.CategoryName);
          setCategories(categoryNames);
          
          // Set selected category from URL if available
          if (categoryName) {
            const formattedCategory = replaceUnderscoreWithSpaces(categoryName);
            const matchedCategory = categoryNames.find(
              (cat) => cat.toLowerCase() === formattedCategory.toLowerCase()
            );
            if (matchedCategory) {
              setSelectedCategory(matchedCategory);
            } else {
              setSelectedCategory("All");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoadingCategories(false);
    };
    
    getAllCategories();
  }, [categoryName]);

  // Fetch merchants after categories and selected category are established
  useEffect(() => {
    if (cityName && !loadingCategories) {
      const getMerchants = async () => {
        setLoading(true);
        try {
          const data = await fetchMerchantsByCity(cityName);
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
          
          // Apply category filter immediately when setting merchants
          let filtered = merchantsWithDiscounts;
          if (selectedCategory !== "All") {
            filtered = filtered.filter(
              (merchant) => merchant.category === selectedCategory
            );
          }
          
          // Apply search query if exists
          if (searchQuery) {
            filtered = filtered.filter((merchant) =>
              merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          
          setFilteredMerchants(filtered);
        } catch (error) {
          console.error("Error fetching merchants:", error);
        }

        setLoading(false);
        pageFullyLoaded.current = true;
      };
      
      getMerchants();
    }
  }, [cityName, selectedCategory, loadingCategories, searchQuery]);

  // Restore scroll position after merchants load
  useEffect(() => {
    if (!loading && pageFullyLoaded.current && scrollPositionRef.current > 0) {
      // Use a small timeout to ensure DOM has fully updated after loading state change
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, filteredMerchants]);

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    navigate(`/${cityName}/Category/${category === "All" ? "All" : category.replace(/\s+/g, "_")}`);
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
        <title>{`Top ${categoryName || "All"} Deals & Discounts in ${cityName} | Rabaat`}</title>
        <meta
          name="description"
          content={`Discover the best ${categoryName || "All"} offers, promotions, and exclusive discounts in ${cityName} on Rabaat.`}
        />
        <meta name="keywords" content="React, SEO, React Helmet" />
      </Helmet>
      
      <div className="card_outer_conainer">
        <div className="container text-center">
          <h1 className="title_of_merchants">Shops in {cityName}</h1>

          {/* Category Scroller */}
          <div className="category-scroller-wrapper">
            <div className="static-all-button">
              <button
                className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => handleCategoryChange("All")}
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
              {loadingCategories ? (
                // Show skeleton buttons for categories while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <button
                    key={index}
                    className="category-btn skeleton-btn"
                    disabled
                  >
                    <span className="skeleton-text"></span>
                  </button>
                ))
              ) : (
                categories.map((category, index) => (
                  <button
                    key={index}
                    className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))
              )}
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
                    className="col-lg-2 col-md-4 col-6 merchant-card-spacing"
                  >
                    <MerchantCard
                      cityName={cityName}
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
                  <button className="rabaat_login_btn" onClick={handleSeeMore}>
                    <span>See More</span>
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
      </div>
    </>
  );
};

export default Merchants;