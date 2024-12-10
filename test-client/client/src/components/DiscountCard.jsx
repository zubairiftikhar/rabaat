import React from "react";
import { FaCreditCard } from "react-icons/fa";
import "../css/branchdiscount.css";

const DiscountCard = ({ discount }) => {
  return (
    <div className="card shadow-sm card_header_discount_main rounded-4 h-100">
      <div className="card-header card_header_discount text-white">
        <h5 className="card-title">{discount.percentage}% Off</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          <span>Applicable Cards:</span>
          <ul>
            {discount.cards.map((card, index) => (
              <li key={index}>
                <div className="card-image mb-3">
                  <img
                    src={`/src/assets/img/cards/hbl${discount.card_image}`}
                    alt="Card"
                    className="img-fluid"
                    style={{ maxWidth: "80px", borderRadius: "8px" }}
                  />
                  {card.name} ({card.type})
                </div>
              </li>
            ))}
          </ul>
        </p>
      </div>
    </div>
  );
};

export default DiscountCard;
