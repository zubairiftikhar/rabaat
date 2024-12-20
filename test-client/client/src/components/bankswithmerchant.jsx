// src/components/BankCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentstyle.css";

const BankWithMerchant = ({ bank, cityId, merchant_Id }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBankClick = () => {
    navigate(`/branchdiscount/${merchant_Id}/${bank.bank_id}/${cityId}`);
  };

  return (
    <div
      className="card marchant_card mb-4"
      onClick={handleBankClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`../../../src/assets/img/banks/${bank.bank_image}`}
        className="card-img-top std-img"
        alt={bank.bank_name}
      />
      <div className="offer-container">
        <div className="offer-details">
          <p className="offer-title">{bank.bank_name}</p>
          <p className="offer-subtext">
            Cards <span>0</span>
          </p>
        </div>
        <div className="offer-discount">
          <span className="discount-up">Up to</span>
          <span className="discount-percent">30%</span>
        </div>
      </div>
    </div>
  );
};

export default BankWithMerchant;
