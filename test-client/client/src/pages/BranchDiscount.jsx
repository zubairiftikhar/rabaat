import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchDiscountsForBranch, fetchBankByBankId } from "../services/api";
import BranchDiscountCard from "../components/BranchDiscountCard";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/branchdiscount.css"; // Import the CSS file here

const BranchDiscount = () => {
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [merchantId, setMerchantId] = useState(null);
  const [bankId, setbankId] = useState(null);
  const [bank, setbank] = useState(null);
  const [branchId, setbranchId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [branchInfo, setBranchInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      const queryParams = new URLSearchParams(location.search);
      const cityIdFromQuery = queryParams.get("CityID");
      setCityId(cityIdFromQuery);
      const merchantIdFromQuery = queryParams.get("MerchantID");
      setMerchantId(merchantIdFromQuery);
      const bankIdFromQuery = queryParams.get("BankID");
      setbankId(bankIdFromQuery);
      const branchIdFromQuery = queryParams.get("BranchID");
      setbranchId(branchIdFromQuery);
    }
  }, [location]);

  useEffect(() => {
    if (bankId) {
      const fetchBankDetails = async () => {
        try {
          const data = await fetchBankByBankId(bankId); // Fetch banks using cityId and merchantId
          setbank(data);
        } catch (error) {
          console.error("Error fetching bank details:", error);
        }
      };
      fetchBankDetails();
    }
  }, [bankId]);

  useEffect(() => {
    if (branchId && merchantId && bankId && cityId) {
      const fetchData = async () => {
        try {
          const data = await fetchDiscountsForBranch(
            branchId,
            merchantId,
            bankId,
            cityId
          );
          if (data && data.length > 0) {
            setBranchInfo({
              branchName: data[0].branchname,
              branchAddress: data[0].branchaddress,
            });
            setDiscounts(data);
          }
        } catch (err) {
          setError("Failed to load discounts.");
        }
      };

      fetchData();
    }
  }, [merchantId, bankId, cityId, branchId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Group discounts by percentage
  const groupedDiscounts = discounts.reduce((acc, discount) => {
    const percentage = discount.percentage;
    if (!acc[percentage]) {
      acc[percentage] = {
        percentage: percentage,
        cards: [],
      };
    }
    acc[percentage].cards.push({
      cardName: discount.cardname,
      cardImage: discount.cardimage,
    });
    return acc;
  }, {});

  // Sort the discounts by percentage in descending order
  const sortedDiscounts = Object.keys(groupedDiscounts)
    .sort((a, b) => b - a) // Sorting in descending order
    .map((percentage) => groupedDiscounts[percentage]);

  return (
    <div className="container">
      <Breadcrumbs />
      {branchInfo && (
        <div className="branch-info">
          <h2>{branchInfo.branchName}</h2>
          <p>{branchInfo.branchAddress}</p>
          <h3 className="text-end">Bank: {bank.name}</h3>
        </div>
      )}
      {discounts.length === 0 && (
        <div className="alert alert-warning text-center">
          No discounts available for this merchant in the selected city and
          bank.
        </div>
      )}
      <h2>Discounts for this Branch</h2>
      <div className="discount-cards">
        {sortedDiscounts.map((discountGroup) => (
          <div key={discountGroup.percentage} className="discount-row">
            <BranchDiscountCard discount={discountGroup} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDiscount;
