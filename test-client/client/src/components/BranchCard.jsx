// src/components/BranchCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const BranchCard = ({ cityName, merchantName, branch }) => {
  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };
  return (
    <Link
      to={`/${cityName}/${replaceSpacesWithUnderscore(merchantName)}/Branch/${
        branch.id
      }/${replaceSpacesWithUnderscore(branch.address)}`}
      className="text-decoration-none"
    >
      <div className="card marchant_b_card mb-4">
        <img
          src={`/public/assets/img/merchants/${branch.image_path}`}
          className="card-img-top marchant_b_card_img"
          alt={branch.name}
        />
        {/* <h5 className="card-title marchant_b_card_h5">{branch.name}</h5> */}
        <h5 className="offer-title pt-2">{branch.name}</h5>
        <p
          className="offer-title"
          style={{ color: "#6e6e6e", fontSize: "12px" }}
        >
          {branch.address}
        </p>
      </div>
    </Link>
  );
};

export default BranchCard;
