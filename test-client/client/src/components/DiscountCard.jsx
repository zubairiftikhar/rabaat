import React from "react";

const DiscountCard = ({ discount }) => {
  const { discount_amount, discount_type, cards, branches } = discount;

  return (
    <div className="card shadow-sm rounded-4 mb-3">
      <div
        className="card-header text-white"
        style={{ backgroundColor: "red", fontWeight: "bold" }}
      >
        <h5 className="card-title mb-0">
          {discount_amount}% {discount_type}
        </h5>
      </div>
      <div className="card-body d-flex flex-column">
        <p className="card-text">
          <strong>Applicable Cards:</strong>
        </p>
        <ul className="list-unstyled">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <li
                key={index}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>{card.cardName}</span>
                {card.cardImage && (
                  <img
                    src={`/src/assets/img/cards/${card.cardImage}`}
                    alt={card.cardName}
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
            <li>No cards available</li>
          )}
        </ul>
        <p className="card-text mt-3">
          <strong>Available Branches:</strong>
        </p>
        <ul className="list-unstyled">
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
