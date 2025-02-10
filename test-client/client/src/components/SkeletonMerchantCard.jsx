import React from "react";
import "../css/skeleton.css"; // Add styles for skeleton effect

const SkeletonMerchantCard = () => {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <p className="skeleton skeleton-text"></p>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-discount"></div>
    </div>
  );
};

export default SkeletonMerchantCard;
