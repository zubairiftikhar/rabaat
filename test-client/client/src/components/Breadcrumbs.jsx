import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  fetchMerchantByMerchantId,
  fetchDiscountsForBranch,
} from "../services/api";

const Breadcrumbs = () => {
  const location = useLocation();
  const { merchantId, bankId, cityId, branchId } = useParams();

  const [merchantName, setMerchantName] = useState(null);
  const [branchName, setBranchName] = useState(null);

  const pathnames = location.pathname.split("/").filter((x) => x);

  useEffect(() => {
    const loadMerchantName = async () => {
      if (merchantId) {
        try {
          const data = await fetchMerchantByMerchantId(merchantId);
          setMerchantName(data.name || "Merchant");
        } catch (error) {
          console.error("Error fetching merchant:", error);
        }
      }
    };

    const loadBranchName = async () => {
      if (branchId && merchantId && bankId && cityId) {
        try {
          const data = await fetchDiscountsForBranch(
            branchId,
            merchantId,
            bankId,
            cityId
          );
          setBranchName(data[0]?.branchaddress || "Branch");
        } catch (error) {
          console.error("Error fetching branch:", error);
        }
      }
    };

    loadMerchantName();
    loadBranchName();
  }, [merchantId, branchId, bankId, cityId]);

  // Build Breadcrumb Links
  const breadcrumbLinks = [
    { name: "Home", path: `/merchants/${bankId}/${cityId}` },
  ];

  if (merchantName) {
    breadcrumbLinks.push({
      name: merchantName,
      path: `/branches/${merchantId}/${bankId}/${cityId}`,
    });
  }

  if (branchName) {
    breadcrumbLinks.push({
      name: branchName,
      path: `/branchdiscount/${branchId}/${merchantId}/${bankId}/${cityId}`,
    });
  }

  return (
    <nav aria-label="breadcrumb" className="mt-2 mb-4">
      <ol className="breadcrumb">
        {breadcrumbLinks.map((crumb, index) => (
          <li
            className={`breadcrumb-item ${
              index === breadcrumbLinks.length - 1 ? "active" : ""
            }`}
            key={index}
          >
            {index !== breadcrumbLinks.length - 1 ? (
              <Link to={crumb.path}>{crumb.name}</Link>
            ) : (
              <span>{crumb.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
