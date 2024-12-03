// src/pages/Merchants.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get bankId and cityId
import { fetchMerchantsByBankAndCity } from "../services/api"; // Import the new API function
import MerchantCard from "../components/MerchantCard";

const Merchants = () => {
  const { bankId, cityId } = useParams(); // Get bankId and cityId from URL params
  const [merchants, setMerchants] = useState([]);
  const [bank, setBank] = useState([]);

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const data = await fetchMerchantsByBankAndCity(bankId, cityId); // Fetch merchants based on bankId and cityId
        setBank(data.bank); // Set bank data
        setMerchants(data.merchants); // Set merchants data
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    getMerchants();
  }, [bankId, cityId]); // Refetch merchants when bankId or cityId changes

  return (
    <>
      <img
        src={`/src/assets/img/banks/${bank.image}`}
        alt={bank.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Merchants in {bank.name}</h1>
            <div class="side_border_dots pt-3 pb-5">
              <span class="line"></span>
              <span class="text">LET'S DISCOVER BY MERCHANTS</span>
              <span class="line"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {merchants.map((merchant) => (
            <div className="col-md-3" key={merchant.id}>
              <MerchantCard bankId={bankId} cityId={cityId} merchant={merchant} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Merchants;
