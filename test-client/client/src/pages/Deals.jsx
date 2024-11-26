// src/pages/Deals.jsx
import React from "react";
import DealCard from "../components/DealCard";

const Deals = ({ deals }) => {
  return (
    <div className="container">
      <div className="row">
        {deals.map((deal) => (
          <div className="col-md-4" key={deal.id}>
            <DealCard deal={deal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
