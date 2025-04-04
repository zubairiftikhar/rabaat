import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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
          const formattedCategory = replaceUnderscoreWithSpaces(categoryName);
          const matchedCategory = uniqueCategories.find(
            (cat) => cat.toLowerCase() === formattedCategory.toLowerCase()
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
          } else {
            setSelectedCategory("All");
          }

        } catch (error) {
          console.error("Error fetching merchants:", error);
        }

        setLoading(false);
      };
      getMerchants();
    }
  }, [cityName, categoryName]);

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
        <title>{`Ramadan 2025 Deals & Discounts in ${cityName} Save More with Rabaat`}</title>
        <meta
          name="description"
          content={`Uncover the best Ramadan 2025 deals and discounts in ${cityName}! Shop, dine, and enjoy exclusive offers. Get special discounts with your bank card only on Rabaat!`}
        />
        <meta name="keywords" content="React, SEO, React Helmet" />
      </Helmet>
      <div className="card_outer_conainer">
        <div className="container text-center">
          <h1>Shops in {cityName}</h1>

          {/* Category Scroller */}
          <div className="category-scroller-wrapper">
            <div className="static-all-button">
              <button
                className={`category-btn ${selectedCategory === "All" ? "active" : ""
                  }`}
                onClick={() => setSelectedCategory("All")}
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
