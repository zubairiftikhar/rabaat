// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { fetchCities } from "../services/api";
import CityCard from "../components/CityCard";

const Home = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const getCities = async () => {
      try {
        const data = await fetchCities();
        console.log(data);
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getCities();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {cities.map((city) => (
          <div className="col-md-4" key={city.id}>
            <CityCard city={city} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
