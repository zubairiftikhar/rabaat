import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMaximumDiscountAnyBank, fetchBranchCount } from "../services/api"; // Import the function

const MerchantCard = ({ cityName, merchant }) => {
  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };

  const navigate = useNavigate();
  const [maxDiscount, setMaxDiscount] = useState(null);  // State to store the maximum discount
  const [branchCount, setBranchCount] = useState(null);
  const [cardCount, setCardCount] = useState(null); // State to store the total card count

  useEffect(() => {
    if (merchant.name && cityName) {
      // Fetch maximum discount and card count for the merchant and city
      const getMaxDiscount = async () => {
        const data = await fetchMaximumDiscountAnyBank(merchant.name, cityName);
        if (data) {
          setMaxDiscount(data.max_discount); // Set the fetched max discount
          setCardCount(data.total_card_count); // Set the fetched total card count
        }
      };
      const getBranchCount = async () => {
        try {
          const data = await fetchBranchCount(merchant.name, cityName);
          if (data && data.branch_count !== undefined) {
            setBranchCount(data);
          } else {
            setBranchCount({ branch_count: 0 }); // Fallback value
          }
        } catch (error) {
          console.error("Error fetching Branch Count:", error);
          setBranchCount({ branch_count: 0 }); // Prevent null access
        }
      };
      getBranchCount();
      getMaxDiscount();
    }
  }, [merchant.name, cityName]);

  const handleClick = () => {
    // Navigate to BranchDetails page with merchant and city details
    navigate(
      `/${replaceSpacesWithUnderscore(cityName)}/${replaceSpacesWithUnderscore(
        merchant.name
      )}`
    );
  };

  return (
    <div
      className="card marchant_card mb-4"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="offer-discount">
        <span className="discount-up">Up to</span>
        <span className="discount-percent">
          {maxDiscount !== null ? `${maxDiscount}%` : "Loading..."}
        </span>
      </div>
      <img
        src={`/public/assets/img/merchants/${merchant.image}`}
        className="card-img-top marchant_card_img"
        alt={merchant.name}
      />
      {/* <p className="card-text marchant_card_p">{merchant.category}</p> */}
      <div className="offer-container">
        <div className="offer-details">
          <p className="offer-title">{merchant.name}</p>
          <div className="card_branch">
            <p className="offer-subtext">
              <span>{cardCount !== null ? cardCount : "Loading..."}</span> Cards
            </p>
            <p style={{ fontSize: "12px" }}>
              Branches {branchCount !== null ? branchCount.branch_count : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
