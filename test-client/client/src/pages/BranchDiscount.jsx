import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDiscountsForBranch, fetchBankByBankName } from "../services/api";
import BranchDiscountCard from "../components/BranchDiscountCard";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/branchdiscount.css";

const BranchDiscount = () => {
  const { cityName, bankName, merchantName, branchId, branchAddress } =
    useParams();
  const [discounts, setDiscounts] = useState([]);
  const [branchInfo, setBranchInfo] = useState(null);
  const [bank, setBank] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  // Fetch bank details
  useEffect(() => {
    if (bankName) {
      const fetchBankDetails = async () => {
        try {
          const data = await fetchBankByBankName(
            replaceUnderscoreWithSpaces(bankName)
          );
          setBank(data);
        } catch (error) {
          console.error("Error fetching bank details:", error);
        }
      };
      fetchBankDetails();
    }
  }, [bankName]);

  // Fetch branch discounts
  useEffect(() => {
    if (branchId && merchantName && bankName && cityName) {
      const fetchData = async () => {
        try {
          const data = await fetchDiscountsForBranch(
            branchId,
            replaceUnderscoreWithSpaces(merchantName),
            replaceUnderscoreWithSpaces(bankName),
            replaceUnderscoreWithSpaces(cityName)
          );
          console.log("City", replaceUnderscoreWithSpaces(cityName));
          console.log("Bank", replaceUnderscoreWithSpaces(bankName));
          console.log("Merchant", replaceUnderscoreWithSpaces(merchantName));
          console.log("Fetched Discounts:", data); // Debugging Log
          if (data && data.length > 0) {
            setBranchInfo({
              branchName: data[0].branchname,
              branchAddress: data[0].branchaddress,
            });
            setDiscounts(data);
          } else {
            setDiscounts([]); // Set empty array if no data
          }
        } catch (err) {
          setError("Failed to load discounts.");
          console.error("Fetch error:", err); // Debugging Log
        }
      };

      fetchData();
    }
  }, [branchId, merchantName, bankName, cityName]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Group and sort discounts by percentage
  const groupedDiscounts = discounts.reduce((acc, discount) => {
    const percentage = discount.percentage;
    if (!acc[percentage]) {
      acc[percentage] = { percentage, cards: [] };
    }
    acc[percentage].cards.push({
      cardName: discount.cardname,
      cardImage: discount.cardimage,
    });
    return acc;
  }, {});

  const sortedDiscounts = Object.keys(groupedDiscounts)
    .sort((a, b) => b - a)
    .map((percentage) => groupedDiscounts[percentage]);

  return (
    <>
      <div className="bank-page-container">
        <div className="bank-banner">
          <img
            src={`../../../../../public/assets/img/banks_banner/${bank?.image_path}`}
            alt={bank?.name}
            className="banner-image"
          />
          <div className="bank-info">
            <img
              src={`../../../../../public/assets/img/banks/${bank?.image_path}`}
              alt={bank?.name}
            />
            <h2 className="bank-name">{bank?.name}</h2>
          </div>
        </div>

        <Breadcrumbs />
        {branchInfo && (
          <div className="hospital-info">
            <h2 className="hospital-name">{branchInfo.branchName}</h2>
            <p className="hospital-address">{branchInfo.branchAddress}</p>
          </div>
        )}
      </div>
      <div className="container">
        {/* <Breadcrumbs />

        <div className="branch-info">
          <h2>{branchInfo.branchName}</h2>
          <p>{branchInfo.branchAddress}</p>
          <h3 className="text-end">Bank: {bank?.name}</h3>
        </div>

        {discounts.length === 0 && (
          <div className="alert alert-warning text-center">
            No discounts available for this merchant in the selected city and
            bank.
          </div>
        )} */}
        <h2>Discounts for this Branch</h2>
        <div className="discount-cards">
          {sortedDiscounts.map((discountGroup) => (
            <div key={discountGroup.percentage} className="discount-row">
              <BranchDiscountCard discount={discountGroup} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BranchDiscount;
