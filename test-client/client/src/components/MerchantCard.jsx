// src/components/MerchantCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MerchantCard = ({ merchant, bankId, cityId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to BranchDetails page with merchant, bank, and city details
    navigate(`/branches/${merchant.id}/${bankId}/${cityId}`);
  };

  return (
    <div
      className="card std-img"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`/src/assets/img/merchants/${merchant.image}`}
        className="card-img-top"
        alt={merchant.name}
      />
        <h5 className="card-title card_city_name">{merchant.name}</h5>
      <div className="card-body">
        <p className="card-text card_category">{merchant.category}</p>
      </div>
    </div>
  );
};

export default MerchantCard;
