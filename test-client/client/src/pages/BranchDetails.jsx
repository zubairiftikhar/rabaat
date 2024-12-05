import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBranchesForMerchant } from "../services/api";
import BranchCard from "../components/BranchCard";
import { fetchMerchantByMerchantId } from "../services/api";
import { FaSearch } from "react-icons/fa"; // Import search icon
import './stylepages.css'

const BranchDetails = () => {
  const { merchantId, bankId, cityId } = useParams();
  const [branches, setBranches] = useState([]);
  const [merchant, setMerchants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [visibleBranches, setVisibleBranches] = useState(4); // State for visible branches
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

    // Fetch branches
    const getBranches = async () => {
      try {
        const data = await fetchBranchesForMerchant(merchantId, cityId);
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    getBranches();
    getMerchants();
  }, [merchantId, bankId, cityId]);

  const loadMoreBranches = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleBranches((prevRows) => prevRows + 4); // Show 4 more branches after a delay
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
                <p>
                  MAX Discount <br />
                  <span>30%</span>
                </p>
              </div>
              <div className="marchant_branch_hero_content1">
                <p>
                  Branches: <span>20</span>
                </p>
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
      <h2 className="mt-5">Branches</h2>

      {branchesToShow.length > 0 ? (
        <div className="row">
          {branchesToShow.map((branch) => (
            <div className="col-md-3" key={branch.id}>
              <BranchCard
                branch={branch}
                merchantId={merchantId}
                bankId={bankId}
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
            className="btn btn-primary"
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
