import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchDiscountsForMerchant } from "../services/api";
import DiscountCard from "../components/DiscountCard";

const MerchantDiscount = () => {
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [merchantId, setMerchantId] = useState(null);
  const [bankId, setbankId] = useState(null);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityIdFromQuery = queryParams.get("CityID");
    setCityId(cityIdFromQuery);
    const merchantIdFromQuery = queryParams.get("MerchantID");
    setMerchantId(merchantIdFromQuery);
    const bankIdFromQuery = queryParams.get("BankID");
    setbankId(bankIdFromQuery);
  }, [location]);

  useEffect(() => {
    const getDiscounts = async () => {
      try {
        const data = await fetchDiscountsForMerchant(
          merchantId,
          bankId,
          cityId
        );

        // Group discounts by discount amount and process card/branch details
        const groupedDiscounts = data.reduce((acc, discount) => {
          const key = discount.discount_amount;
          if (!acc[key]) {
            acc[key] = {
              discount_amount: discount.discount_amount,
              discount_type: discount.discount_type,
              cards: new Map(
                discount.cards.map(({ cardName, cardImage }) => [
                  cardName,
                  cardImage,
                ])
              ),
              branches: discount.branches,
            };
          } else {
            discount.cards.forEach(({ cardName, cardImage }) =>
              acc[key].cards.set(cardName, cardImage)
            );
          }
          return acc;
        }, {});

        let formattedDiscounts = Object.values(groupedDiscounts).map(
          (group) => ({
            discount_amount: group.discount_amount,
            discount_type: group.discount_type,
            cards: Array.from(group.cards, ([cardName, cardImage]) => ({
              cardName,
              cardImage,
            })),
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
          <div className="col-12" key={index}>
            <DiscountCard discount={discount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantDiscount;
