// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const BankCard = ({ bank, cityName }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };

  const handleBankClick = () => {
    navigate(`/${cityName}/Bank/${replaceSpacesWithUnderscore(bank.name)}`); // Navigate to Merchants page with bankId and cityId
  };

  return (
    <div
      className="card card_s"
      onClick={handleBankClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`../public/assets/img/banks/${bank.image}`}
        className="card-img-top std-img"
        alt={bank.name}
      />
      <h3>{bank.name}</h3>
    </div>
  );
};

export default BankCard;
