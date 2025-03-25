// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const BankCardCard = ({ card, cityID, cityName, bankName }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };

  const handleBankClick = () => {
    navigate(
      `/${replaceSpacesWithUnderscore(
        cityName
      )}/Bank/${replaceSpacesWithUnderscore(
        bankName
      )}/${replaceSpacesWithUnderscore(card.CardName)}`
    ); // Navigate to Merchants page with bankId and cityId
  };

  return (
    <>

      <div
        className="marchant_card my-3"
        onClick={handleBankClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={`/public/assets/img/cards/${card.image_path}`}
          className="card-img-top marchant_card_img"
          alt={card.CardName}
        />
        <p className="offer-container">{card.CardName}</p>
      </div>
      {/* <div class="Atm_card" style={{ cursor: "pointer" }} onClick={handleBankClick}>
        <img
          src={`/public/assets/img/cards/${card.image_path}`}
          className="img"
          alt={card.CardName}
        />
        <div class="textBox">
          <h5 className="card-title card_city_name">{card.CardName}</h5>
        </div>
      </div> */}

    </>
  );
};

export default BankCardCard;
