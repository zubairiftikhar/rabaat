import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMerchantsByBankAndCity, fetchCityById } from "../services/api";
import MerchantCard from "../components/MerchantCard";
import "../css/cityload.css";

const Merchants = () => {
  const { bankId, cityId } = useParams();
  const [merchants, setMerchants] = useState([]);
  const [bank, setBank] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // State for visible rows
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByBankAndCity(bankId, cityId);
        setBank(data.bank);
        setMerchants(data.merchants);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    getMerchants();
  }, [bankId, cityId]);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const merchantsToShow = merchants.slice(0, visibleRows * 3); // 3 merchants per row

  return (
    <>
      <img
        src={`/src/assets/img/banks/${bank.image}`}
        alt={bank.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <div className="container">
        <div>
          <h4>Merchants in {bank.name}</h4>
        </div>
        <div className="row">
          {merchantsToShow.map((merchant, index) => (
            <div
              className={`col-md-4 fade-in ${loadingMore ? "loading" : ""}`} // Apply animation class conditionally
              key={merchant.id}
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <MerchantCard
                bankId={bankId}
                cityId={cityId}
                merchant={merchant}
              />
            </div>
          ))}
        </div>
        {merchantsToShow.length < merchants.length && ( // Show button if more merchants are available
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

export default Merchants;
