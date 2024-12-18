// src/components/BranchCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BranchCard = ({ branch, merchantId, cityId }) => {
  return (
    <Link
      to={`/branch-details/${merchantId}/${cityId}`} // Removed bankId from the link
      className="text-decoration-none" // Removes underline
    >
      <div className="card marchant_b_card mb-4">
        <img
          src={`/src/assets/img/merchants/${branch.image_path}`}
          className="card-img-top marchant_b_card_img"
          alt={branch.name}
        />
        <h5 className="card-title marchant_b_card_h5">{branch.name}</h5>
        <p className="card-text">{branch.address}</p>
      </div>
    </Link>
  );
};

export default BranchCard;
