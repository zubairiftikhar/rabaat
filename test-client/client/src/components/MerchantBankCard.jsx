import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMaximumDiscountBankAndCard,
  fetchCityById,
} from "../services/api"; // Import the function

const MerchantCard = ({ cityName, merchant, cityId, bankName, cardName }) => {
  const navigate = useNavigate();
  const [maxDiscount, setMaxDiscount] = useState(null); // State to store the maximum discount
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (merchant.id && cityId && bankName && cardName) {
      // Fetch maximum discount and card count for the merchant and city
      const getMaxDiscount = async () => {
        const data = await fetchMaximumDiscountBankAndCard(
          merchant.id,
          cityId,
          bankName,
          cardName
        );
        if (data) {
          setMaxDiscount(data.max_discount); // Set the fetched max discount
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
  }, [merchant.id, cityId, bankName, cardName]);

  const handleClick = () => {
    // Navigate to BranchDetails page with merchant and city details
    navigate(
      `/BankDiscount/${bankName}/${cardName}/${merchant.name}?CityID=${cityId}&MerchantID=${merchant.id}`
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
