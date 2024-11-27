import React from "react";

const DiscountCard = ({ discount }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5>{discount.percentage}% Off</h5>
      </div>
      <img
        src={`/assets/img/discounts/${discount.image_path}`}
        className="card-img-top"
        alt={discount.title}
      />
      <div className="card-body">
        <h6>{discount.title}</h6>
        <p>
          {discount.card_names
            ? `Applicable Cards: ${discount.card_names}`
            : "All Cards"}
        </p>
      </div>
    </div>
  );
};

export default DiscountCard;
