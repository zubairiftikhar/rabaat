// src/pages/Banks.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get cityId
import { fetchBanksByCity } from "../services/api"; // Import API function
import BankCard from "../components/BankCard";

const Banks = () => {
  const { cityId } = useParams(); // Get cityId from URL params
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const getBanks = async () => {
      try {
        const data = await fetchBanksByCity(cityId); // Fetch banks based on cityId
        setBanks(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    getBanks();
  }, [cityId]); // Refetch banks when cityId changes

  return (
    <div className="container">
      <h2>Banks in the City</h2>
      <div className="row">
        {banks.map((bank) => (
          <div className="col-md-4" key={bank.id}>
            <BankCard bank={bank} cityId={cityId} />{" "}
            {/* Pass cityId as a prop */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banks;
