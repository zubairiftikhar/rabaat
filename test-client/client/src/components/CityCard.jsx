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
      className="card"
      onClick={handleCityClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`../src/assets/img/cities/${city.image}`}
        className="card-img-top std-img"
        alt={city.name}
      />
      <div className="card-body">
        <h5 className="card-title">{city.name}</h5>
      </div>
    </div>
  );
};

export default CityCard;
