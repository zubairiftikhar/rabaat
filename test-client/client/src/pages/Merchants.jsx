import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMerchantsByBankAndCity, fetchCityById } from "../services/api";
import MerchantCard from "../components/MerchantCard";
import { FaSearch } from "react-icons/fa"; // Import search icon
import "../css/cityload.css";

const Merchants = () => {
  const { bankId, cityId } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [bank, setBank] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // State for visible rows
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByBankAndCity(bankId, cityId);
        setBank(data.bank);
        setMerchants(data.merchants);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    getMerchants();
  }, [bankId, cityId]);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter merchants by name
  );

  const merchantsToShow = filteredMerchants.slice(0, visibleRows * 3); // 3 merchants per row

  const isLoadMoreDisabled = merchantsToShow.length >= filteredMerchants.length; // Disable if all merchants are loaded

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
            {/* Search Input with Icon */}
            <div className="d-flex pt-3 pb-4">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch /> {/* React Icon Search Icon */}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Merchant Here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
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
              className={`col-md-3 fade-in ${loadingMore ? "loading" : ""}`} // Apply animation class conditionally
              key={merchant.id}
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <MerchantCard
                bankId={bankId}
                cityId={cityId}
                merchant={merchant}
              />
            </div>
          ))}
        </div>
        {/* Only show "Load More" button if there are more merchants to load */}
        {filteredMerchants.length > merchantsToShow.length &&
          filteredMerchants.length > 6 && (
            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={loadMore}
                disabled={isLoadMoreDisabled} // Disable button if all merchants are loaded
              >
                {loadingMore ? "Loading..." : "Read More"}
              </button>
            </div>
          )}
      </div>
    </>
  );
};

export default Merchants;
