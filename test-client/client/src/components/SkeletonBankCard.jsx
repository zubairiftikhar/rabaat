import React from "react";
import "../css/skeleton.css"; // Add styles for skeleton effect

const SkeletonBankCard = () => {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-img"></div>
    </div>
  );
};

export default SkeletonBankCard;
