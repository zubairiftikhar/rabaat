import React from "react";
import { Link } from "react-router-dom";

const DiscountCard = ({ discount, merchantId, bankId, cityId }) => {
  return (
    <div className="col-12 mb-3">
      <Link
        to={`/discounts/${discount.id}`} // Link to the discount details page
        className="text-decoration-none" // Removes underline
      >
        <div className="card shadow-sm border-0 rounded-3 h-100">
          <div className="card-header bg-primary text-white">
            <h5 className="card-title">{discount.percentage}% Off</h5>
          </div>
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">{discount.title}</h6>
            <p className="card-text">
              {discount.card_names
                ? `Applicable Cards: ${discount.card_names}`
                : "All Cards"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DiscountCard;
