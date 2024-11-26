// src/pages/BranchDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchCardsForMerchant,
  fetchBranchesForMerchant,
} from "../services/api";
import DiscountCard from "../components/DiscountCard";
import BranchCard from "../components/BranchCard";

const BranchDetails = () => {
  const { merchantId, bankId, cityId } = useParams();
  const [cards, setCards] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    // Fetch cards for merchant, bank, and city
    const getCards = async () => {
      try {
        const data = await fetchCardsForMerchant(merchantId, bankId, cityId);
        setCards(data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    // Fetch branches for merchant and city
    const getBranches = async () => {
      try {
        const data = await fetchBranchesForMerchant(merchantId, cityId);
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    getCards();
    getBranches();
  }, [merchantId, bankId, cityId]);

  return (
    <div className="container">
      <h2>Cards Offering Discounts</h2>
      <div className="row">
        {cards.map((card) => (
          <div className="col-md-4" key={card.id}>
            <DiscountCard card={card} />
          </div>
        ))}
      </div>

      <h2 className="mt-4">Branches</h2>
      <div className="row">
        {branches.map((branch) => (
          <div className="col-md-6" key={branch.id}>
            <BranchCard branch={branch} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDetails;
