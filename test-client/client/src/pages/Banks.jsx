import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBanksByCity, fetchCityById } from "../services/api";
import BankCard from "../components/BankCard";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";

const Banks = () => {
  const { cityId } = useParams();
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // State for visible rows
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay

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
      setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const banksToShow = banks.slice(0, visibleRows * 4); // 4 banks per row

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
        {banksToShow.length < banks.length && ( // Show button if more banks are available
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={loadMore}>
              {loadingMore ? "Loading..." : "Read More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Banks;
