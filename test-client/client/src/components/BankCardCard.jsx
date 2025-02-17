// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const BankCardCard = ({ card, cityID, cityName, bankName }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBankClick = () => {
    navigate(`/${cityName}/${bankName}/${card.CardName}/${cityID}`); // Navigate to Merchants page with bankId and cityId
  };

  return (
    <div
      className="card card_s"
      onClick={handleBankClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`/public/assets/img/cards/${card.image_path}`}
        className="card-img-top std-img"
        alt={card.CardName}
      />
      <h5 className="card-title card_city_name">{card.CardName}</h5>
    </div>
  );
};

export default BankCardCard;
