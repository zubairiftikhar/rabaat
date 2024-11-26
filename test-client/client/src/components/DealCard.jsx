// src/components/DealCard.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DealCard = ({ deal }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{deal.title}</h5>
        <p className="card-text">{deal.description}</p>
      </div>
    </div>
  );
};

export default DealCard;
