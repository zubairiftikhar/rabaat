// src/components/BranchDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBranchesForMerchant } from "../services/api";
import BranchCard from "../components/BranchCard";
import {
  fetchMerchantByMerchantId,
  fetchBranchCount,
  fetchDiscountBanks,
} from "../services/api";
import { FaSearch } from "react-icons/fa"; // Import search icon
import "./stylepages.css";
import Breadcrumbs from "../components/Breadcrumbs";
import BankWithMerchant from "../components/bankswithmerchant";

const BranchDetails = () => {
  const { merchantId, cityId } = useParams(); // Removed bankId from useParams
  const [branches, setBranches] = useState([]);
  const [banksWithDiscounts, setBanksWithDiscounts] = useState([]);
  const [branchesCount, setBranchesCount] = useState([]);
  const [merchant, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [visibleBranches, setVisibleBranches] = useState(6); // State for visible branches (6 initially)
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more branches

  useEffect(() => {
    // Fetch merchant details
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantByMerchantId(merchantId);
        setMerchants(data);
      } catch (error) {
        console.error("Error fetching merchant:", error);
      }
    };

    // Fetch Banks
    const getchBanks = async () => {
      try {
        const data = await fetchDiscountBanks(cityId, merchantId); // Fetch banks using cityId and merchantId
        setBanksWithDiscounts(data);
      } catch (error) {
        console.error("Error fetching banks with discounts:", error);
      }
    };

    // Fetch branches
    const getBranches = async () => {
      try {
        const data = await fetchBranchesForMerchant(merchantId, cityId);
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    // Fetch branches Count
    const getBranchesCount = async () => {
      try {
        const data = await fetchBranchCount(merchantId, cityId);
        setBranchesCount(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    getBranchesCount();
    getBranches();
    getMerchants();
    getchBanks();
  }, [merchantId, cityId]); // Removed bankId and max discount logic

  const loadMoreBranches = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleBranches((prevRows) => prevRows + 6); // Show 6 more branches after a delay
      setLoadingMore(false);
    }, 1000);
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by branch name
      branch.address.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by branch address
  );

  const branchesToShow = filteredBranches.slice(0, visibleBranches); // Slice based on visibleBranches

  const isLoadMoreDisabled = branchesToShow.length >= filteredBranches.length; // Disable button if all branches are loaded

  return (
    <div className="container">
      <Breadcrumbs />
      {merchant && (
        <>
          <div className="row mt-5 marchant_branch_hero_row">
            <div className="col-lg-3 col-md-12 col-sm-12 p-0">
              <img
                src={`/src/assets/img/merchants/${merchant.image_path}`}
                className="card-img-top"
                alt={merchant.name}
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              <div className="marchant_branch_hero_content">
                <h2>{merchant.name}</h2>
              </div>
              <div className="marchant_branch_hero_content1">
                <p>Branches: {branchesCount.branch_count}</p>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Search Input for Filtering Branches */}
      <div className="d-flex mt-5 page_search">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search Branch Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>
      </div>
      <h2 className="mt-5">Banks</h2>
      <div className="row">
        {banksWithDiscounts.map((bank) => (
          <div className="col-md-2" key={bank.bank_id}>
            <BankWithMerchant
              bank={bank}
              cityId={cityId}
              merchant_Id={merchantId}
            />
          </div>
        ))}
      </div>
      <h2 className="mt-5">Branches</h2>
      {branchesToShow.length > 0 ? (
        <div className="row">
          {branchesToShow.map((branch) => (
            <div className="col-md-2" key={branch.id}>
              <BranchCard
                branch={branch}
                merchantId={merchantId} // Removed bankId from here
                cityId={cityId}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No branches available for this merchant.</p>
      )}
      {/* Load More Button for Branches */}
      {filteredBranches.length > branchesToShow.length && (
        <div className="text-center mt-4">
          <button
            className="btn"
            style={{ backgroundColor: "red", color: "white" }}
            onClick={loadMoreBranches}
            disabled={isLoadMoreDisabled} // Disable if all branches are loaded
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BranchDetails;
