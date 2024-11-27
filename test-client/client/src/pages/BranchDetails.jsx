import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBranchesForMerchant,
  fetchDiscountsForMerchant,
} from "../services/api";
import BranchCard from "../components/BranchCard";
import DiscountCard from "../components/DiscountCard";
import { fetchMerchantByMerchantId } from "../services/api";

const BranchDetails = () => {
  const { merchantId, bankId, cityId } = useParams();
  const [discounts, setDiscounts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [merchant, setMerchants] = useState([]);

  useEffect(() => {
    // Fetch discounts
    const getDiscounts = async () => {
      try {
        const data = await fetchDiscountsForMerchant(
          merchantId,
          bankId,
          cityId
        );
        setDiscounts(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    const getMerchants = async () => {
      try {
        const data = await fetchMerchantByMerchantId(merchantId);
        setMerchants(data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    // Fetch branches
    const getBranches = async () => {
      try {
        const data = await fetchBranchesForMerchant(merchantId, cityId);
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    getDiscounts();
    getBranches();
    getMerchants();
  }, [merchantId, bankId, cityId]);

  return (
    <div className="container">
      <img
        src={`/src/assets/img/merchants/${merchant.image_path}`}
        className="card-img-top"
        alt={merchant.name}
        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
      />
      <h2>Discounts</h2>
      <div className="row">
        {discounts.map((discount) => (
          <div className="col-12 mb-3" key={discount.id}>
            <DiscountCard discount={discount} />
          </div>
        ))}
      </div>

      <h2 className="mt-4">Branches</h2>
      <div className="row">
        {branches.map((branch) => (
          <div className="col-md-6" key={branch.id}>
            <BranchCard
              branch={branch}
              merchantId={merchantId}
              bankId={bankId}
              cityId={cityId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchDetails;
