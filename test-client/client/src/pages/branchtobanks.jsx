import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; // To access merchantId and cityId from the URL
import { fetchDiscountBanks } from "../services/api"; // Function to fetch banks offering discounts
import BankWithMerchantBranch from "../components/bankswithmerchantbranch";
import { FaSearch } from "react-icons/fa"; // Import search icon
import Breadcrumbs from "../components/Breadcrumbs";

const BranchToBankDetails = () => {
  const { cityName, merchantName, branchAddress } = useParams();
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [merchant_Id, setMerchantId] = useState(null);
  const [branch_Id, setbranchId] = useState(null);
  const [banksWithDiscounts, setBanksWithDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [visibleBanks, setVisibleBanks] = useState(4); // State for visible banks
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more banks

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location) {
      const queryParams = new URLSearchParams(location.search);
      const cityIdFromQuery = queryParams.get("CityID");
      setCityId(cityIdFromQuery);
      const merchantIdFromQuery = queryParams.get("MerchantID");
      setMerchantId(merchantIdFromQuery);
      const branchIdFromQuery = queryParams.get("BranchID");
      setbranchId(branchIdFromQuery);
    }
  }, [location]); // Get cityId and merchantId from the URL

  useEffect(() => {
    if (cityId && merchant_Id) {
      const fetchBanks = async () => {
        try {
          const data = await fetchDiscountBanks(cityId, merchant_Id); // Fetch banks using cityId and merchantId
          setBanksWithDiscounts(data);
        } catch (error) {
          console.error("Error fetching banks with discounts:", error);
        }
      };

      fetchBanks();
    }
  }, [cityId, merchant_Id]);

  const loadMoreBanks = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleBanks((prevRows) => prevRows + 4); // Show 4 more banks after a delay
      setLoadingMore(false);
    }, 1000);
  };

  const filteredBanks = banksWithDiscounts.filter(
    (bank) => bank.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by bank name
  );

  const banksToShow = filteredBanks.slice(0, visibleBanks); // Slice based on visibleBanks

  const isLoadMoreDisabled = banksToShow.length >= filteredBanks.length; // Disable button if all banks are loaded

  return (
    <div className="container col-10">
      <div className="banks-with-discounts">
        <Breadcrumbs />
        <h2>Banks Offering Discounts</h2>
        <div className="container">
          {/* Search Input for Filtering Banks */}
          <div className="d-flex pt-3 pb-4 page_search">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search Banks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              />
            </div>
          </div>

          {/* Display an error message if no banks are found */}
          {filteredBanks.length === 0 ? (
            <div className="alert alert-warning text-center">
              No banks found offering discounts in this city for the selected
              merchant. Please check back later.
            </div>
          ) : (
            <div className="row">
              {/* Display the filtered banks */}
              {banksToShow.map((bank) => (
                <div className="col-md-2" key={bank.bank_id}>
                  <BankWithMerchantBranch
                    cityName={cityName}
                    merchantName={merchantName}
                    branchAddress={branchAddress}
                    bank={bank}
                    branch_Id={branch_Id}
                    cityId={cityId}
                    merchant_Id={merchant_Id}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button for Banks */}
          {filteredBanks.length > banksToShow.length && (
            <div className="text-center mt-4">
              <button
                className="btn"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={loadMoreBanks}
                disabled={isLoadMoreDisabled} // Disable if all banks are loaded
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchToBankDetails;
