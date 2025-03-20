import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchBanksByCityName } from "../services/api";
import BankCard from "../components/BankCard";
import SkeletonBankCard from "../components/SkeletonBankCard";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";

const Banks = () => {
  const { cityName } = useParams();
  const [banks, setBanks] = useState([]);
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);
  const [visibleBanks, setVisibleBanks] = useState(12); // Initially showing 2 rows (assuming 6 per row)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityIdFromQuery = queryParams.get("CityID");
    setCityId(cityIdFromQuery);
  }, [location]);

  useEffect(() => {
    setLoading(true);
    const getBanks = async () => {
      try {
        const data = await fetchBanksByCityName(cityName);
        setBanks(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };
    getBanks();
  }, [cityName]);

  // Filtered banks based on search query
  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load More function to display additional rows
  const loadMore = () => {
    setVisibleBanks((prevVisible) => prevVisible + 6); // Load one more row (6 banks)
  };

  return (
    <>
      {/* <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm text-center">
            <div className="d-flex pt-3 pb-4 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch /> 
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Bank Here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Bank Cards */}
      <div className="card_outer_conainer">
      <div className="container">
        <div className="row text-center">
        <h1>Banks in {cityName}</h1>
        <p>Discover a variety of banking categories offering great savings and benefits!</p>
          {loading ? (
            <div className="row">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="col-lg-2 col-md-6 col-sm-12 mb-5">
                  <SkeletonBankCard />
                </div>
              ))}
            </div>
          ) : (
            filteredBanks.slice(0, visibleBanks).map((bank) => (
              <div className="col-md-2 fade-in my-4" key={bank.id}>
                <BankCard bank={bank} cityId={cityId} cityName={cityName} />
              </div>
            ))
          )}
        </div>

        {/* Load More Button (Visible if more banks are available) */}
        {visibleBanks < filteredBanks.length && (
          <div className="text-center my-4">
            <button className="btn btn-primary" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default Banks;
