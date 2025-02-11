// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const BankCard = ({ bank, cityId }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBankClick = () => {
    navigate(`/merchants/${bank.id}/${cityId}`); // Navigate to Merchants page with bankId and cityId
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
      <h5 className="card-title card_city_name">{bank.name}</h5>
    </div>
  );
};

export default BankCard;
