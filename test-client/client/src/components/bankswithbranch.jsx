// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const BankWithBranch = ({ bank, cityId, branchId, merchant_Id }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBankClick = () => {
    navigate(
      `/branchdiscount/${branchId}/${merchant_Id}/${bank.bank_Id}/${cityId}`
    );
  };

  return (
    <div
      className="card"
      onClick={handleBankClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`../../../src/assets/img/banks/${bank.bank_image}`}
        className="card-img-top std-img"
        alt={bank.bank_name}
      />
      <h5 className="card-title card_city_name">{bank.bank_name}</h5>
    </div>
  );
};

export default BankWithBranch;
