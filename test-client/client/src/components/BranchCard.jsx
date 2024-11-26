// src/components/BranchCard.jsx
import React from "react";

const BranchCard = ({ branch }) => {
  return (
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
  );
};

export default BranchCard;
