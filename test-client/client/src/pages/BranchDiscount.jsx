import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDiscountsForMerchant } from "../services/api";
import DiscountCard from "../components/DiscountCard";
import Breadcrumbs from "../components/Breadcrumbs";

const BranchDiscount = () => {
  const { merchantId, bankId, cityId } = useParams();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const data = await fetchDiscountsForMerchant(
          merchantId,
          bankId,
          cityId
        );

        // Transform discounts to match the UI requirements
        const groupedDiscounts = data.reduce((acc, discount) => {
          const key = discount.discount_amount;
          if (!acc[key]) {
            acc[key] = {
              discount_amount: discount.discount_amount,
              discount_type: discount.discount_type,
              cards: new Set(discount.card_names),
              branches: discount.branches,
            };
          } else {
            discount.card_names.forEach((card) => acc[key].cards.add(card));
          }
          return acc;
        }, {});

        let formattedDiscounts = Object.values(groupedDiscounts).map(
          (group) => ({
            discount_amount: group.discount_amount,
            discount_type: group.discount_type,
            cards: Array.from(group.cards),
            branches: group.branches,
          })
        );

        // Sort discounts in descending order by discount amount
        formattedDiscounts = formattedDiscounts.sort(
          (a, b) => b.discount_amount - a.discount_amount
        );

        setDiscounts(formattedDiscounts);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    getDiscounts();
  }, [merchantId, bankId, cityId]);

  return (
    <div className="container">
      <Breadcrumbs />
      <h2>Discounts for Merchant</h2>
      {discounts.length === 0 && (
        <div className="alert alert-warning text-center">
          No discounts available for this merchant in the selected city and
          bank.
        </div>
      )}
      <div className="row">
        {discounts.map((discount, index) => (
          <div className="col-12 col-md-6 mb-3" key={index}>
            <DiscountCard discount={discount} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default BranchDiscount;
