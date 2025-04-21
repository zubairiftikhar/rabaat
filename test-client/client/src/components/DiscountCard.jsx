import React from "react";

const DiscountCard = ({ discount }) => {
  const { discount_amount, discount_type, cards, day_name } = discount;

  return (
    <>
    <div className="container">Day = {day_name}</div>
    <div className="discount-card-container shadow-sm rounded-4 mb-3">
      <div className="discount-card-header text-white">
        <h5 className="card-title mb-0 text-center">
          {discount_amount}% {discount_type}
        </h5>
      </div>
      
      <div className="discount-card-body">
        <div className="discount-card-grid">
          {cards.length > 0 ? (
            cards.map((card, index) => (
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
    // <div className="card shadow-sm rounded-4 mb-3">
    //   <div
    //     className="card-header text-white"
    //     style={{ backgroundColor: "red", fontWeight: "bold" }}
    //   >
    //     <h5 className="card-title mb-0">
    //       {discount_amount}% {discount_type}
    //     </h5>
    //   </div>
    //   <div className="card-body d-flex flex-column">
    //     <p className="card-text">
    //       <strong>Applicable Cards:</strong>
    //     </p>
    //     <ul className="list-unstyled">
    //       {cards.length > 0 ? (
    //         cards.map((card, index) => (
    //           <li
    //             key={index}
    //             className="d-flex justify-content-between align-items-center mb-2"
    //           >
    //             <span>{card.cardName}</span>
    //             {card.cardImage && (
    //               <img
    //                 src={`/public/assets/img/cards/${card.cardImage}`}
    //                 alt={card.cardName}
    //                 style={{
    //                   width: "60px",
    //                   height: "auto",
    //                   objectFit: "contain",
    //                 }}
    //               />
    //             )}
    //           </li>
    //         ))
    //       ) : (
    //         <li>No cards available</li>
    //       )}
    //     </ul>
    //   </div>
    // </div>
  );
};

export default DiscountCard;
