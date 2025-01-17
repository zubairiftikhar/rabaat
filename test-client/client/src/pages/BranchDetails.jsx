// src/components/BranchDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchBranchesForMerchant } from "../services/api";
import BranchCard from "../components/BranchCard";
import {
  fetchMerchantByMerchantId,
  fetchBranchCount,
  fetchDiscountBanks,
  fetchMaximumDiscountAnyBank,
} from "../services/api";
import { FaSearch } from "react-icons/fa"; // Import search icon

import BankIcon from "../../public/assets/img/landing/bank_icon.png";
import DiscountIcon from "../../public/assets/img/landing/discount_icon.png";
import MarchentIcon from "../../public/assets/img/landing/marchent_icon.png";
import "./stylepages.css";
import Breadcrumbs from "../components/Breadcrumbs";
import BankWithMerchant from "../components/bankswithmerchant";
import { Helmet } from "react-helmet";

const BranchDetails = () => {
  const { cityName, merchantName } = useParams();
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [merchantId, setMerchantId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [banksWithDiscounts, setBanksWithDiscounts] = useState([]);
  const [banksMaxDiscount, setBanksMaxDiscount] = useState([]);
  const [branchesCount, setBranchesCount] = useState([]);
  const [merchant, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [visibleBranches, setVisibleBranches] = useState(6); // State for visible branches (6 initially)
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more branches

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
    }
  }, [location]);

  useEffect(() => {
    if (merchantId && cityId) {
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
      const getBanksMaxDiscount = async () => {
        try {
          const data = await fetchMaximumDiscountAnyBank(merchantId, cityId);
          setBanksMaxDiscount(data);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      getBanksMaxDiscount();
      getBranchesCount();
      getBranches();
      getMerchants();
      getchBanks();
    }
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
    <>
      <div className="brand-container">
        <div className="brand-images">
          <img
            src={`/public/assets/img/merchant_banner/${merchant.image_path}`}
            alt="adidas_1"
          />
        </div>
        <div className="brand-header">
          <div className="brand-logo">
            <img
              src={`/public/assets/img/merchants/${merchant.image_path}`}
              alt={merchant.name}
            />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">{merchant.name}</h1>
            <p className="brand-description">
              {`
              Explore unbeatable deals and discounts exclusively available at
              ${merchant.name}, brought to you by various leading banks in
              Pakistan. Whether you're dining at a restaurant, shopping for
              trendy clothes, or planning a fun day out, enjoy incredible
              savings with your bank's offers. Stay up-to-date with the latest
              discounts and make the most of your bank cards. With rabaat.com,
              accessing discounts is just a click away!`}
            </p>
          </div>

          <div className="stats_container_fluid">
            <div className="stats-container">
              <div className="stat-button">
                <img src={BankIcon} alt="" /> No of Cards{" "}
                <span>{banksMaxDiscount.total_card_count}</span>
              </div>
              <div className="stat-button">
                <img src={DiscountIcon} alt="" /> Max Discount{" "}
                <span>{banksMaxDiscount.max_discount}%</span>
              </div>
            </div>

            <div className="stat-button">
              <img src={MarchentIcon} alt="" /> Branches{" "}
              <span>{branchesCount.branch_count}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <Breadcrumbs />
        <Helmet>
          <title>{`Rabaat | ${merchant.name}`}</title>
          <meta
            name="description"
            content={`Discover the best deals and discounts near you with Rabaat. Save on shopping, dining, and more with exclusive offers in ${merchant.name}!`}
          />
          <meta name="keywords" content="React, SEO, React Helmet" />
        </Helmet>
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
                cityName={cityName}
                merchantName={merchantName}
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
                  cityName={cityName}
                  merchantName={merchantName}
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
    </>
  );
};

export default BranchDetails;
