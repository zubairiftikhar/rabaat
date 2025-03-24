import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentstyle.css";

const BranchDiscountCard = ({ discount }) => {
  return (
    <>
      <div className="container">Day = {discount.day_name}</div> {/* Display day_name */}
      <div className="discount-card-container shadow-sm rounded-4 mb-3">
        <div className="discount-card-header text-white">
          <h5 className="card-title mb-0 text-center">
            {discount.percentage}% {discount.discount_type}
          </h5>
        </div>
        <div className="discount-card-body">
          <div className="discount-card-grid">
            {discount.cards && discount.cards.length > 0 ? (
              discount.cards.map((card, index) => (
                <div key={index} className="discount-card">
                  {card.cardImage && (
                    <img
                      src={`/public/assets/img/cards/${card.cardImage}`}
                      alt={card.cardName}
                      className="discount-card-image"
                    />
                  )}
                  <span className="discount-card-name">{card.cardName}</span>
                </div>
              ))
            ) : (
              <div className="no-cards-available">No cards available</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


export default BranchDiscountCard;
