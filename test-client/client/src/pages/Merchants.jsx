import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMerchantsByCity,
  fetchMaximumDiscountAnyBank,
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleMerchants, setVisibleMerchants] = useState(ROW_SIZE * 3);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const pageFullyLoaded = useRef(false);
  const scrollPositionRef = useRef(0);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  // On mount, try to restore previous state
  useEffect(() => {
    const restoreStateFromSession = () => {
      try {
        const savedState = sessionStorage.getItem(getSessionKey(cityName));
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setSearchQuery(parsedState.searchQuery || "");
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

  useEffect(() => {
    if (cityName) {
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
          setFilteredMerchants(merchantsWithDiscounts);

          const uniqueCategories = [
            ...new Set(merchantsWithDiscounts.map((m) => m.category)),
          ];
          setCategories(uniqueCategories);

          // Automatically activate the category from the URL
          if (categoryName) {
            const formattedCategory = replaceUnderscoreWithSpaces(categoryName);
            const matchedCategory = uniqueCategories.find(
              (cat) => cat.toLowerCase() === formattedCategory.toLowerCase()
            );
            if (matchedCategory) {
              setSelectedCategory(matchedCategory);
            } else {
              setSelectedCategory("All");
            }
          }

        } catch (error) {
          console.error("Error fetching merchants:", error);
        }

        setLoading(false);
        pageFullyLoaded.current = true;
      };
      getMerchants();
    }
  }, [cityName, categoryName]);

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

    // Don't reset visibleMerchants unless explicitly going to a new category
    // This preserves "load more" state when returning to the page
  }, [selectedCategory, searchQuery, merchants]);

  const handleSeeMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleMerchants((prev) => prev + ROW_SIZE * 2);
      setLoadingMore(false);
    }, 1000);
  };

  return (
    <>
      <Breadcrumbs />
      <Helmet>
        <title>{`Top ${categoryName} Deals & Discounts in ${cityName} | Rabaat`}</title>
        <meta
          name="description"
          content={`Discover the best ${categoryName} offers, promotions, and exclusive discounts in ${cityName} on Rabaat.`}
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
                className={`category-btn ${selectedCategory === "All" ? "active" : ""
                  }`}
                onClick={() => {
                  setSelectedCategory("All")
                  navigate(`/${cityName}/Category/${"All"}`);
                }}
              >
                All
              </button>
            </div>
            <div className="category-scroller" ref={scrollRef}>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-btn ${selectedCategory === category ? "active" : ""
                    }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    navigate(`/${cityName}/Category/${category.replace(/\s+/g, "_")}`);
                  }}
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