import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMaximumDiscountAnyBank, fetchCityById } from "../services/api"; // Import the function

const MerchantCard = ({ cityName, merchant, cityId }) => {
  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };

  const navigate = useNavigate();
  const [maxDiscount, setMaxDiscount] = useState(null); // State to store the maximum discount
  const [cardCount, setCardCount] = useState(null); // State to store the total card count
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (merchant.id && cityId) {
      // Fetch maximum discount and card count for the merchant and city
      const getMaxDiscount = async () => {
        const data = await fetchMaximumDiscountAnyBank(merchant.id, cityId);
        if (data) {
          setMaxDiscount(data.max_discount); // Set the fetched max discount
          setCardCount(data.total_card_count); // Set the fetched total card count
        }
      };
      const getCity = async () => {
        const data = await fetchCityById(cityId);
        if (data) {
          setCity(data); // Set the fetched City
        }
      };
      getCity();
      getMaxDiscount();
    }
  }, [merchant.id, cityId]);

  const handleClick = () => {
    // Navigate to BranchDetails page with merchant and city details
    navigate(
      `/${replaceSpacesWithUnderscore(cityName)}/${replaceSpacesWithUnderscore(
        merchant.name
      )}?MerchantID=${merchant.id}&CityID=${cityId}`
    );
  };

  return (
    <div
      className="card marchant_card mb-4"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`/public/assets/img/merchants/${merchant.image}`}
        className="card-img-top marchant_card_img"
        alt={merchant.name}
      />
      <p className="card-text marchant_card_p">{merchant.category}</p>
      <div className="offer-container">
        <div className="offer-details">
          <p className="offer-title">{merchant.name}</p>
          <p className="offer-subtext">
            Cards <span>{cardCount !== null ? cardCount : "Loading..."}</span>
          </p>
        </div>
        <div className="offer-discount">
          <span className="discount-up">Up to</span>
          <span className="discount-percent">
            {maxDiscount !== null ? `${maxDiscount}%` : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
