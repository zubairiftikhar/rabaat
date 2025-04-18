import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  fetchMerchantByMerchantName,
  fetchBranchByBranchId,
} from "../services/api";
import Cookies from "js-cookie";

const Breadcrumbs = () => {
  const cityName = Cookies.get("selectedCityName");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const merchantId = queryParams.get("MerchantID");
  const cityId = queryParams.get("CityID");
  const branchId = queryParams.get("BranchID"); // If you need this for branch details

  const [merchantName, setMerchantName] = useState(null);
  const [branchName, setBranchName] = useState(null);

  useEffect(() => {
    const loadMerchantName = async () => {
      if (merchantId) {
        try {
          const data = await fetchMerchantByMerchantName(merchantId);
          setMerchantName(data.name || "Merchant");
        } catch (error) {
          console.error("Error fetching merchant:", error);
        }
      }
    };

    const loadBranchName = async () => {
      if (branchId) {
        try {
          const data = await fetchBranchByBranchId(branchId);
          setBranchName(data?.address || "Branch");
        } catch (error) {
          console.error("Error fetching branch:", error);
        }
      }
    };

    loadMerchantName();
    loadBranchName();
  }, [merchantId, branchId]);

  // Build Breadcrumb Links
  const breadcrumbLinks = [
    { name: "Home", path: `/${cityName}?CityID=${cityId}` },
  ];

  if (merchantName) {
    breadcrumbLinks.push({
      name: merchantName,
      path: `/${cityName}/${merchantName}?MerchantID=${merchantId}&CityID=${cityId}`,
    });
  }

  if (branchName) {
    breadcrumbLinks.push({
      name: branchName,
      path: `/branch-details?BranchID=${branchId}&MerchantID=${merchantId}&CityID=${cityId}`,
    });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <nav aria-label="breadcrumb" className="">
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
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
