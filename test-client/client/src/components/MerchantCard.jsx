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
      className="card marchant_card mb-4"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`/src/assets/img/merchants/${merchant.image}`}
        className="card-img-top marchant_card_img"
        alt={merchant.name}
      />
      <p className="card-text marchant_card_p">{merchant.category}</p>
      <div class="offer-container">
        <div class="offer-details">
          <p class="offer-title">{merchant.name}</p>
          <p class="offer-subtext">Card • 4</p>
        </div>
        <div class="offer-discount">
          <span class="discount-up">Up to</span>
          <span class="discount-percent">30%</span>
        </div>
      </div>
      {/* <div className="marchant_card_div">
        <h5 className="card-title marchant_card_h5">{merchant.name}</h5>
        <div className="max_dis_on_card">
          <h6 className="max_dis_on_card_name">
            Card Name
          </h6>
          <span>Upto 10%</span>
        </div>
      </div> */}
    </div>
  );
};

export default MerchantCard;
