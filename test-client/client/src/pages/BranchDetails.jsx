// src/components/BranchDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBranchesForMerchant } from "../services/api";
import BranchCard from "../components/BranchCard";
import {
  fetchMerchantByMerchantName,
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

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  useEffect(() => {
    if (merchantName && cityName) {
      // Fetch merchant details
      const getMerchants = async () => {
        try {
          const data = await fetchMerchantByMerchantName(
            replaceUnderscoreWithSpaces(merchantName)
          );
          setMerchants(data);
        } catch (error) {
          console.error("Error fetching merchant:", error);
        }
      };

      // Fetch Banks
      const getchBanks = async () => {
        try {
          const data = await fetchDiscountBanks(
            replaceUnderscoreWithSpaces(cityName),
            replaceUnderscoreWithSpaces(merchantName)
          ); // Fetch banks using cityId and merchantId
          setBanksWithDiscounts(data);
        } catch (error) {
          console.error("Error fetching banks with discounts:", error);
        }
      };

      // Fetch branches
      const getBranches = async () => {
        try {
          const data = await fetchBranchesForMerchant(
            replaceUnderscoreWithSpaces(merchantName),
            replaceUnderscoreWithSpaces(cityName)
          );
          setBranches(data);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };

      // Fetch branches Count
      const getBranchesCount = async () => {
        try {
          const data = await fetchBranchCount(
            replaceUnderscoreWithSpaces(merchantName),
            replaceUnderscoreWithSpaces(cityName)
          );
          setBranchesCount(data);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      const getBanksMaxDiscount = async () => {
        try {
          const data = await fetchMaximumDiscountAnyBank(
            replaceUnderscoreWithSpaces(merchantName),
            replaceUnderscoreWithSpaces(cityName)
          );
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
  }, [merchantName, cityName]); // Removed bankId and max discount logic

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
            alt={merchant.name}
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
        <div className="row shopcontainerw85">

       
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
        {banksWithDiscounts.length > 0 ? (
          <div className="row">
            {banksWithDiscounts.map((bank) => (
              <div className="col-lg-2 col-md-4 col-4 merchant-card-spacing" key={bank.bank_id}>
                <BankWithMerchant
                  cityName={replaceUnderscoreWithSpaces(cityName)}
                  merchantName={replaceUnderscoreWithSpaces(merchantName)}
                  bank={bank}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No banks available for this merchant.</p>
        )}
        <h2 className="mt-5">Branches</h2>
        {branchesToShow.length > 0 ? (
          <div className="row">
            {branchesToShow.map((branch) => (
              <div className="col-md-2" key={branch.id}>
                <BranchCard
                  cityName={cityName}
                  merchantName={merchantName}
                  branch={branch}
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
              className="btn rabaat_login_btn"
              style={{ background: "transparent", color: "black" }}
              onClick={loadMoreBranches}
              disabled={isLoadMoreDisabled} // Disable if all branches are loaded
            >
              <span>{loadingMore ? "Loading..." : "Load More"}</span>
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default BranchDetails;
