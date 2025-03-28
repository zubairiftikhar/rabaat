import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCardsByBank } from "../services/api";
import BankCardCard from "../components/BankCardCard";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";
import SkeletonBankCard from "../components/SkeletonBankCard";

const Cards = () => {
  const { cityName, bankName, cityID } = useParams();
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(8); // State for visible cards
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [loading, setLoading] = useState(true);

  const replaceUnderscoreWithSpaces = (name) => {
    return name.replace(/_/g, " ");
  };

  useEffect(() => {
    setLoading(true);
    const getCards = async () => {
      try {
        const data = await getCardsByBank(
          replaceUnderscoreWithSpaces(bankName)
        );
        setCards(data || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };
    getCards();
  }, [bankName]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCards((prevCards) => prevCards + 8);
      setLoadingMore(false);
    }, 1000);
  };

  const filteredCards = cards.filter(
    (card) => card.CardName?.toLowerCase().includes(searchQuery.toLowerCase()) // Ensure `CardName` exists
  );

  const cardsToShow = filteredCards.slice(0, visibleCards);
  const isLoadMoreDisabled = cardsToShow.length >= filteredCards.length;

  return (
    <>
      <div className="container pt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1>
              Cards of {replaceUnderscoreWithSpaces(bankName)}
            </h1>
            {/* <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY CARDS</span>
              <span className="line"></span>
            </div> */}
            {/* Search Input with Icon */}
            <div className="d-flex pt-3 pb-4 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Card Here..."
                  style={{border: "none"}}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card Listing */}
      <div className="container py-5">
        <div className="row">
          {loading ? (
            <div className="row">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="col-lg-2 col-md-6 col-sm-12 mb-5">
                  <SkeletonBankCard />
                </div>
              ))}
            </div>
          ) : (
            cardsToShow.map((card, index) => (
              <div
                className={`col-lg-3 col-md-4 col-6 merchant-card-spacing fade-in ${loadingMore ? "loading" : ""}`}
                key={card.id || index} // Ensure a unique key
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BankCardCard
                  card={card}
                  cityName={cityName}
                  cityID={cityID}
                  bankName={bankName}
                />
              </div>
            ))
          )}
        </div>
        {/* Load More Button */}
        {filteredCards.length > cardsToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn rabaat_login_btn"
              style={{ background: "transparent", color: "black" }}
              onClick={loadMore}
              disabled={isLoadMoreDisabled}
            >
            <span>{loadingMore ? "Loading..." : "Load More"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cards;
