// src/components/BranchCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BranchCard = ({ branch, merchantId, bankId, cityId }) => {
  return (
    <Link
      to={`/branchdiscount/${branch.id}/${merchantId}/${bankId}/${cityId}`} // Link to the BranchDiscount page
      className="text-decoration-none" // Removes underline
    >
      <div className="card">
        <img
          src={`/assets/img/branches/${branch.image_path}`}
          className="card-img-top"
          alt={branch.name}
        />
        <div className="card-body">
          <h5 className="card-title">{branch.name}</h5>
          <p className="card-text">{branch.address}</p>
        </div>
      </div>
    </Link>
  );
};

export default BranchCard;
