// src/components/CardCard.jsx
import React from "react";

const DiscountCard = ({ card }) => {
  return (
    <div className="card">
      <img
        src={`/assets/img/cards/${card.image_path}`}
        className="card-img-top"
        alt={card.card_name}
      />
      <div className="card-body">
        <h5 className="card-title">{card.card_name}</h5>
        <p className="card-text">{card.card_type}</p>
      </div>
    </div>
  );
};

export default DiscountCard;
