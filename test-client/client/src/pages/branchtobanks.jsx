import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To access branchId and cityId from the URL
import { fetchDiscountBanks } from "../services/api"; // Function to fetch banks offering discounts
import BankWithBranch from "../components/bankswithbranch";

const BranchToBankDetails = () => {
  const { merchant_Id, branchId, cityId } = useParams(); // Get branchId and cityId from the URL
  const [banksWithDiscounts, setBanksWithDiscounts] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await fetchDiscountBanks(branchId, cityId); // Fetch only banks offering discounts
        setBanksWithDiscounts(data);
      } catch (error) {
        console.error("Error fetching banks with discounts:", error);
      }
    };

    fetchBanks();
  }, [branchId, cityId]);

  return (
    <div className="banks-with-discounts">
      <h2>Banks Offering Discounts</h2>
      <div className="container">
        <div className="row">
          {banksWithDiscounts.map((bank) => (
            <div className="col-md-4" key={bank.bank_Id}>
              <BankWithBranch
                bank={bank}
                cityId={cityId}
                branchId={branchId}
                merchant_Id={merchant_Id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchToBankDetails;
