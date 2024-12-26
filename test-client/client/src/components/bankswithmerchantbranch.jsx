import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentstyle.css";
import { fetchMaximumDiscount } from "../services/api"; // Import the function

const BankWithMerchantBranch = ({ bank, branch_Id, cityId, merchant_Id }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [maxDiscount, setMaxDiscount] = useState(null); // State to store the maximum discount
  const [cardCount, setCardCount] = useState(null); // State to store the total card count

  useEffect(() => {
    // Fetch maximum discount and card count for the merchant, branch, city, and bank
    const getMaxDiscount = async () => {
      const data = await fetchMaximumDiscount(
        merchant_Id,
        bank.bank_id,
        cityId
      );
      if (data) {
        setMaxDiscount(data.max_discount); // Set the fetched max discount
        setCardCount(data.total_card_count); // Set the fetched total card count
      }
    };
    getMaxDiscount();
  }, [merchant_Id, bank.bank_id, cityId]);

  const handleBankClick = () => {
    navigate(
      `/branchdiscount?MerchantID=${merchant_Id}&BranchID=${branch_Id}&BankID=${bank.bank_id}&CityID=${cityId}`
    );
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
            Cards <span>{cardCount !== null ? cardCount : "Loading..."}</span>
          </p>
        </div>
        <div className="offer-discount">
          <span className="discount-up">Up to</span>
          <span className="discount-percent">
            {maxDiscount !== null ? `${maxDiscount}%` : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BankWithMerchantBranch;
