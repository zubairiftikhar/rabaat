// src/pages/Banks.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get cityId
import { fetchBanksByCity, fetchCityById } from "../services/api"; // Import API function
import BankCard from "../components/BankCard";
import Mainsecsearch from "../components/mainsecsearch/Mainsecsearch";
import '../components/mainsecsearch/mainsecsearch.css';

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
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Banks in {city.name}</h1>
            <div class="side_border_dots pt-3 pb-5">
              <span class="line"></span>
              <span class="text">LET'S DISCOVER BY BANKS</span>
              <span class="line"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {/* <img
          src={`../src/assets/img/cities/${city.image_path}`}
          alt={city.name}
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
        /> */}
        <div className="row">
          {banks.map((bank) => (
            <div className="col-md-3" key={bank.id}>
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
