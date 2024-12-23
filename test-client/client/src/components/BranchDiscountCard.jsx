import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentstyle.css";

const BranchDiscountCard = ({ discount }) => {
  return (
    <div className="card shadow-sm rounded-4 mb-3">
      {/* Card Header */}
      <div
        className="card-header text-white"
        style={{ backgroundColor: "red", fontWeight: "bold" }}
      >
        <h5 className="card-title mb-0">{discount.percentage}% Discount</h5>
      </div>

      {/* Card Body */}
      <div className="card-body d-flex flex-column">
        {/* Applicable Cards Section */}
        <div className="applicable-cards mt-3">
          <p className="card-text">
            <strong>Applicable Cards:</strong>
          </p>
          <ul className="list-unstyled">
            {discount.cards && discount.cards.length > 0 ? (
              discount.cards.map((card, index) => (
                <li
                  key={index}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>{card.cardName}</span>
                  {card.cardImage && (
                    <img
                      src={`/src/assets/img/cards/${card.cardImage}`}
                      alt={card.cardName}
                      className="card-image"
                      style={{
                        width: "60px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </li>
              ))
            ) : (
              <li>No applicable cards</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BranchDiscountCard;
