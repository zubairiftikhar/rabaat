// src/pages/Banks.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get cityId
import { fetchBanksByCity, fetchCityById } from "../services/api"; // Import API function
import BankCard from "../components/BankCard";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";

const Banks = () => {
  const { cityId } = useParams(); // Get cityId from URL params
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState([]);

  useEffect(() => {
    const getBanks = async () => {
      try {
        const data = await fetchBanksByCity(cityId); // Fetch banks based on cityId
        setBanks(data);
        const cityData = await fetchCityById(cityId);
        setCity(cityData);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    getBanks();
  }, [cityId]); // Refetch banks when cityId changes

  return (
    <>
      <Mainsecsearch city={city} />
      <div className="container">
        {/* <img
          src={`../src/assets/img/cities/${city.image_path}`}
          alt={city.name}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        /> */}
        <div>
          <h4>Banks in {city.name}</h4>
        </div>
        <div className="row">
          {banks.map((bank) => (
            <div className="col-md-4" key={bank.id}>
              <BankCard bank={bank} cityId={cityId} />
              {/* Pass cityId as a prop */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Banks;
