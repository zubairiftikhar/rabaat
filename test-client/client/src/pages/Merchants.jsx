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
      <div className="container">
        <div>
          <h4>Merchants in {bank.name}</h4>
        </div>
        <div className="row">
          {merchants.map((merchant) => (
            <div className="col-md-4" key={merchant.id}>
              <MerchantCard bankId={bankId} cityId={cityId} merchant={merchant} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Merchants;
