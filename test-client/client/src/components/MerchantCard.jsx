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
    <div className="card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        src={`/assets/img/merchants/${merchant.image_path}`}
        className="card-img-top"
        alt={merchant.name}
      />
      <div className="card-body">
        <h5 className="card-title">{merchant.name}</h5>
        <p className="card-text">{merchant.category}</p>
      </div>
    </div>
  );
};

export default MerchantCard;
