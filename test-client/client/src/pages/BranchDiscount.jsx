import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDiscountsForBranch } from "../services/api";
import DiscountCard from "../components/DiscountCard";
import Breadcrumbs from "../components/Breadcrumbs";

const BranchDiscount = () => {
  const { branchId, merchantId, bankId, cityId } = useParams();
  const [branchDetails, setBranchDetails] = useState({});
  const [groupedDiscounts, setGroupedDiscounts] = useState([]);

  useEffect(() => {
    const getBranchDiscounts = async () => {
      try {
        const data = await fetchDiscountsForBranch(
          branchId,
          merchantId,
          bankId,
          cityId
        );

        // Assuming the response data is an array and contains branch details as well
        const branchInfo = {
          branch_name: data[0]?.branchname,
          branch_address: data[0]?.branchaddress,
          branch_image: data[0]?.branchimage, // Assuming this is a valid image path
          bank_name: data[0]?.bankname,
          bank_image: data[0]?.bankimage, // Assuming this is a valid image path
        };
        setBranchDetails(branchInfo);

        // Group discounts by percentage
        const grouped = data.reduce((acc, discount) => {
          if (!acc[discount.percentage]) {
            acc[discount.percentage] = {
              percentage: discount.percentage,
              title: discount.discount_title || `${discount.percentage}% Off`,
              card_image: discount.cardimage,
              cards: [],
            };
          }
          acc[discount.percentage].cards.push({
            name: discount.cardname,
          });
          return acc;
        }, {});

        // Convert grouped object to an array and sort by percentage (descending)
        const sortedDiscounts = Object.values(grouped).sort(
          (a, b) => b.percentage - a.percentage
        );

        setGroupedDiscounts(sortedDiscounts);
      } catch (error) {
        console.error("Error fetching branch discounts:", error);
      }
    };

    getBranchDiscounts();
  }, [branchId, merchantId, bankId, cityId]);

  return (
    <div className="container">
      <Breadcrumbs />
      <div className="branch-info text-center mb-4">
        {branchDetails.branch_image && (
          <img
            src={`/src/assets/img/merchants/${branchDetails.branch_image}`}
            alt="Branch"
            className="img-fluid mb-3"
            style={{ maxWidth: "300px", borderRadius: "8px" }}
          />
        )}
        <h3>{branchDetails.branch_name}</h3>
        <p>{branchDetails.branch_address}</p>
        <div>
          {branchDetails.bank_image && (
            <img
              src={`/src/assets/img/banks/${branchDetails.bank_image}`}
              alt="Bank"
              className="img-fluid"
              style={{ maxWidth: "50px", borderRadius: "50%" }}
            />
          )}
          <h4>{branchDetails.bank_name}</h4>
        </div>
      </div>
      <h2>Discounts for this Branch</h2>
      {groupedDiscounts.length === 0 && (
        <div className="alert alert-warning text-center">
          No discounts available for this branch.
        </div>
      )}
      <div className="row">
        {groupedDiscounts.map((discount) => (
          <div className="col-12 col-md-6 mb-3" key={discount.percentage}>
            <DiscountCard discount={discount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDiscount;
