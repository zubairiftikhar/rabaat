// src/pages/BranchDiscount.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDiscountsForBranch } from "../services/api";
import DiscountCard from "../components/DiscountCard";

const BranchDiscount = () => {
  const { branchId, merchantId, bankId, cityId } = useParams();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const getBranchDiscounts = async () => {
      try {
        const data = await fetchDiscountsForBranch(
          branchId,
          merchantId,
          bankId,
          cityId
        );
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching branch discounts:", error);
      }
    };

    getBranchDiscounts();
  }, [branchId, merchantId, bankId, cityId]);

  return (
    <div className="container">
      <h2>Discounts for this Branch</h2>
      <div className="row">
        {discounts.map((discount) => (
          <div className="col-12 mb-3" key={discount.id}>
            <DiscountCard discount={discount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDiscount;
