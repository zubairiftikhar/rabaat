import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To access branchId and cityId from the URL
import { fetchDiscountBanks } from "../services/api"; // Function to fetch banks offering discounts
import BankWithBranch from "../components/bankswithbranch";
import { FaSearch } from "react-icons/fa"; // Import search icon

const BranchToBankDetails = () => {
  const { merchant_Id, branchId, cityId } = useParams(); // Get branchId and cityId from the URL
  const [banksWithDiscounts, setBanksWithDiscounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [visibleBanks, setVisibleBanks] = useState(4); // State for visible banks
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more banks

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await fetchDiscountBanks(branchId, cityId); // Fetch only banks offering discounts
        setBanksWithDiscounts(data);
      } catch (error) {
        console.error("Error fetching banks with discounts:", error);
      }
    };

    fetchBanks();
  }, [branchId, cityId]);

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
    <div className="banks-with-discounts">
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

        {/* Display the filtered banks */}
        <div className="row">
          {banksToShow.map((bank) => (
            <div className="col-md-4" key={bank.bank_Id}>
              <BankWithBranch
                bank={bank}
                cityId={cityId}
                branchId={branchId}
                merchant_Id={merchant_Id}
              />
            </div>
          ))}
        </div>

        {/* Load More Button for Banks */}
        {filteredBanks.length > banksToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={loadMoreBanks}
              disabled={isLoadMoreDisabled} // Disable if all banks are loaded
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchToBankDetails;
