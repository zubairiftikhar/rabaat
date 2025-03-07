import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchBanksByCityName } from "../services/api";
import BankCard from "../components/BankCard";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";
import SkeletonBankCard from "../components/SkeletonBankCard";

const Banks = () => {
  const { cityName } = useParams();
  const [banks, setBanks] = useState([]);
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);

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

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter banks by name
  );

  const navigate = useNavigate();

  return (
    <>
      <Mainsecsearch />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 py-5">
            <div className="switch-buttons">
              <button
                type="button"
                className={`switch-btn ${
                  location.pathname.includes("Bank") ? "" : "active"
                }`}
                onClick={() => navigate(`/${cityName}`)}
              >
                Merchants
              </button>
              <button
                type="button"
                className={`switch-btn ${
                  location.pathname.includes("Bank") ? "active" : ""
                }`}
                onClick={() => navigate(`/${cityName}/Bank`)}
              >
                Banks
              </button>
              <div
                className={`switch-slider ${
                  location.pathname.includes("Bank") ? "move-right" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading">Banks in {cityName}</h1>
            {/* Search Input with Icon */}
            <div className="d-flex pt-3 pb-4 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch /> {/* React Icon Search Icon */}
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
      </div>
      <div className="container">
        <div className="row">
          {loading ? (
            <div className="row">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="col-lg-2 col-md-6 col-sm-12 mb-5">
                  <SkeletonBankCard />
                </div>
              ))}
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <div className="col-md-2 fade-in" key={bank.id}>
                <BankCard bank={bank} cityId={cityId} cityName={cityName} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Banks;
