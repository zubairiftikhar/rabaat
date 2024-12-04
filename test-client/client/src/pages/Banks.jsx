import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBanksByCity, fetchCityById } from "../services/api";
import BankCard from "../components/BankCard";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";

const Banks = () => {
  const { cityId } = useParams();
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState([]);
  const [visibleCards, setVisibleCards] = useState(8); // State for visible cards
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const getBanks = async () => {
      try {
        const data = await fetchBanksByCity(cityId);
        setBanks(data);
        const cityData = await fetchCityById(cityId);
        setCity(cityData);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    getBanks();
  }, [cityId]);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleCards((prevCards) => prevCards + 8); // Show 8 more cards after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const filteredBanks = banks.filter(
    (bank) => bank.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter banks by name
  );

  const banksToShow = filteredBanks.slice(0, visibleCards); // Show banks up to visibleCards count

  const isLoadMoreDisabled = banksToShow.length >= filteredBanks.length; // Disable if all banks are loaded

  return (
    <>
      <Mainsecsearch city={city} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Banks in {city.name}</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY BANKS</span>
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
          {banksToShow.map((bank, index) => (
            <div
              className={`col-md-3 fade-in ${loadingMore ? "loading" : ""}`} // Apply animation class conditionally
              key={bank.id}
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <BankCard bank={bank} cityId={cityId} />
            </div>
          ))}
        </div>
        {/* Only show "Load More" button if there are more banks to load */}
        {filteredBanks.length > banksToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn btn-primary"
              onClick={loadMore}
              disabled={isLoadMoreDisabled} // Disable button if all banks are loaded
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Banks;
