import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  fetchDiscountsForMerchant,
  fetchBankByBankName,
} from "../services/api";
import DiscountCard from "../components/DiscountCard";
import "./stylepages.css";

const MerchantDiscount = () => {
  const { cityName, merchantName, bankName } = useParams();
  const [discounts, setDiscounts] = useState([]);
  const [bank, setbank] = useState([]);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (bankName) {
      const fetchBankDetails = async () => {
        try {
          const data = await fetchBankByBankName(
            replaceUnderscoreWithSpaces(bankName)
          ); // Fetch banks using cityId and merchantId
          setbank(data);
        } catch (error) {
          console.error("Error fetching bank details:", error);
        }
      };
      fetchBankDetails();
    }
  }, [bankName]);

  useEffect(() => {
    if (merchantName && bankName && cityName) {
      const getDiscounts = async () => {
        try {
          const data = await fetchDiscountsForMerchant(
            replaceUnderscoreWithSpaces(merchantName),
            replaceUnderscoreWithSpaces(bankName),
            replaceUnderscoreWithSpaces(cityName)
          );

          // Group discounts by discount amount and process card/branch details
          const groupedDiscounts = data.reduce((acc, discount) => {
            const key = discount.discount_amount;
            if (!acc[key]) {
              acc[key] = {
                discount_amount: discount.discount_amount,
                discount_type: discount.discount_type,
                day_name: discount.day_name,
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
              day_name: group.day_name,
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
    }
  }, [merchantName, bankName, cityName]);

  return (
    <>
      <div className="bank-page-container">
        <div className="bank-banner">
          <img
            src={`../../../public/assets/img/banks_banner/${bank.image_path}`}
            alt={bank.name}
            className="banner-image"
          />
          <div className="bank-info">
            <img
              src={`../../../public/assets/img/banks/${bank.image_path}`}
              alt={bank.name}
            />
            <h2 className="bank-name">{bank.name}</h2>
          </div>
        </div>

        {/* <div className="hospital-info">
          <h3 className="hospital-name">Ai Raza Hospital</h3>
          <p className="hospital-address">
            Al Razi Hospital - 2-C, Main
            M.M.Alam Road, Gulberg 3, Lahore - Pakistan
          </p>
        </div> */}
      </div>
      <div className="container">
        <Breadcrumbs />
        {/* <div class="side_border_dots pt-3 pb-5">
          <span class="line"></span>
          <span class="text">Discounts for Merchant</span>
          <span class="line"></span>
        </div> */}
        {/* <h3 className="text-end">Bank: {bank.name}</h3> */}
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
    </>
  );
};

export default MerchantDiscount;
