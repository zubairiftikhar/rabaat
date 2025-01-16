import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchDiscountsForBranch, fetchBankByBankId } from "../services/api";
import BranchDiscountCard from "../components/BranchDiscountCard";
import Breadcrumbs from "../components/Breadcrumbs";
import "../css/branchdiscount.css";
import Bank from '../../public/assets/img/landing/hbl.png'


const BranchDiscount = () => {
  const location = useLocation();
  const [queryParams, setQueryParams] = useState({});
  const [discounts, setDiscounts] = useState([]);
  const [branchInfo, setBranchInfo] = useState(null);
  const [bank, setBank] = useState(null);
  const [error, setError] = useState(null);

  // Parse query params on component mount or location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQueryParams({
      cityId: params.get("CityID"),
      merchantId: params.get("MerchantID"),
      bankId: params.get("BankID"),
      branchId: params.get("BranchID"),
    });
  }, [location]);

  // Fetch bank details
  useEffect(() => {
    if (queryParams.bankId) {
      const fetchBankDetails = async () => {
        try {
          const data = await fetchBankByBankId(queryParams.bankId);
          setBank(data);
        } catch (error) {
          console.error("Error fetching bank details:", error);
        }
      };
      fetchBankDetails();
    }
  }, [queryParams.bankId]);

  // Fetch branch discounts
  useEffect(() => {
    const { branchId, merchantId, bankId, cityId } = queryParams;

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
  }, [queryParams]);

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
            src={Bank}
            alt="HBL Banner"
            className="banner-image"
          />
          <div className="bank-info">
            {/* <img
              src={`../../../public/assets/img/banks/${bank.image_path}`}
              alt={bank.name}
            /> */}
            <h2 className="bank-name">{bank?.name}</h2>
          </div>
        </div>

        <Breadcrumbs />
        {branchInfo && (
          <div className="hospital-info">
            <h2 className="hospital-name">{branchInfo.branchName}</h2>
            <p className="hospital-address">
              {branchInfo.branchAddress}
            </p>
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
