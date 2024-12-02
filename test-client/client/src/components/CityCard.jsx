// src/components/CityCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const CityCard = ({ city }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCityClick = () => {
    navigate(`/banks/${city.id}`); // Navigate to the Banks page with cityId
  };

  return (
    <div
      className="card card_s"
      onClick={handleCityClick}
      style={{ cursor: "pointer", borderradius: "10px" }}
    >
      <img
        src={`../src/assets/img/cities/${city.image}`}
        className="card-img-top std-img"
        alt={city.name}
      />
      <h5 className="card-title card_city_name">{city.name}</h5>
    </div>
  );
};

export default CityCard;
