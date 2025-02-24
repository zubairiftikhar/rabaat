import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMaximumDiscountBankAndCard,
  fetchCityByName,
} from "../services/api"; // Import the function

const MerchantCard = ({ cityName, merchant, bankName, cardName }) => {
  const navigate = useNavigate();
  const [maxDiscount, setMaxDiscount] = useState(null); // State to store the maximum discount
  const [city, setCity] = useState(null);

  const replaceSpacesWithUnderscore = (name) => {
    return name.replace(/\s+/g, "_");
  };

  useEffect(() => {
    if (merchant.name && cityName && bankName && cardName) {
      // Fetch maximum discount and card count for the merchant and city
      const getMaxDiscount = async () => {
        const data = await fetchMaximumDiscountBankAndCard(
          merchant.name,
          cityName,
          bankName,
          cardName
        );
        if (data) {
          setMaxDiscount(data.max_discount); // Set the fetched max discount
        }
      };
      const getCity = async () => {
        const data = await fetchCityByName(cityName);
        if (data) {
          setCity(data); // Set the fetched City
        }
      };
      getCity();
      getMaxDiscount();
    }
  }, [merchant.name, cityName, bankName, cardName]);

  const handleClick = () => {
    // Navigate to BranchDetails page with merchant and city details
    navigate(
      `/${replaceSpacesWithUnderscore(
        cityName
      )}/Bank/${replaceSpacesWithUnderscore(
        bankName
      )}/${replaceSpacesWithUnderscore(cardName)}/${replaceSpacesWithUnderscore(
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
      <img
        src={`/public/assets/img/merchants/${merchant.image}`}
        className="card-img-top marchant_card_img"
        alt={merchant.name}
      />
      <p className="card-text marchant_card_p">{merchant.category}</p>
      <div className="offer-container">
        <div className="offer-details">
          <p className="offer-title">{merchant.name}</p>
        </div>
        <div className="offer-discount">
          <span className="discount-percent">
            {maxDiscount !== null ? `${maxDiscount}%` : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MerchantCard;
