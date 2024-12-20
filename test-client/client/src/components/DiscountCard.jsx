import React from "react";
import "../css/branchdiscount.css";

const DiscountCard = ({ discount }) => {
  const { discount_amount, discount_type, cards, branches } = discount;

  return (
    <div className="card shadow-sm card_header_discount_main rounded-4 h-100">
      <div className="card-header card_header_discount text-white">
        <h5 className="card-title">
          {discount_amount}% {discount_type}
        </h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          <strong>Applicable Cards:</strong>
        </p>
        <ul>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <li key={index}>
                <div className="bank_card_image mb-2">
                  {card}
                  <img
                    src={`/src/assets/img/cards/${card.toLowerCase()}.png`}
                    alt={card}
                    className="img-fluid"
                    style={{ maxWidth: "50px", marginLeft: "10px" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              </li>
            ))
          ) : (
            <li>No cards available</li>
          )}
        </ul>
        <p className="card-text mt-3">
          <strong>Available Branches:</strong>
        </p>
        <ul>
          {branches.length > 0 ? (
            branches.map((branch, index) => (
              <li key={index}>
                <strong>{branch.branchName}</strong> - {branch.address}
              </li>
            ))
          ) : (
            <li>No branches available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DiscountCard;
