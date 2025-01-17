import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDiscountDetail } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const DiscountDetail = () => {
  const { discountId } = useParams();
  const [discountDetail, setDiscountDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (discountId) {
      const getDiscountDetail = async () => {
        try {
          setLoading(true);
          const data = await fetchDiscountDetail(discountId);
          setDiscountDetail(data);
        } catch (error) {
          setError("Failed to fetch discount details.");
        } finally {
          setLoading(false);
        }
      };
      getDiscountDetail();
    }
  }, [discountId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!discountDetail) return <p>No discount details available.</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title">{discountDetail.title}</h2>
        </div>
        <div className="card-body">
          <p>{discountDetail.description}</p>
          <h4>Applicable Cards</h4>
          {discountDetail.cards.length > 0 ? (
            <ul className="list-group">
              {discountDetail.cards.map((card) => (
                <li key={card.id} className="list-group-item">
                  <strong>{card.card_name}</strong> ({card.card_type}) -{" "}
                  {card.bank_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No cards available for this discount.</p>
          )}
          <h4 className="mt-4">Branches Offering This Discount</h4>
          {discountDetail.branches.length > 0 ? (
            <ul className="list-group">
              {discountDetail.branches.map((branch) => (
                <li key={branch.id} className="list-group-item">
                  <strong>{branch.name}</strong> - {branch.address}
                </li>
              ))}
            </ul>
          ) : (
            <p>No branches available for this discount.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountDetail;
