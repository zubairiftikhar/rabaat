import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCardsByBank } from "../services/api";
import BankCardCard from "../components/BankCardCard";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";

const Cards = () => {
  const { cityName, bankName, cityID } = useParams();
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(8); // State for visible cards
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const getCards = async () => {
      try {
        const data = await getCardsByBank(bankName);
        setCards(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    getCards();
  }, [bankName]);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleCards((prevCards) => prevCards + 8); // Show 8 more cards after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const filteredCards = cards.filter(
    (card) => card.CardName.toLowerCase().includes(searchQuery.toLowerCase()) // Filter banks by name
  );

  const cardsToShow = filteredCards.slice(0, visibleCards); // Show banks up to visibleCards count

  const isLoadMoreDisabled = cardsToShow.length >= filteredCards.length; // Disable if all banks are loaded

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading">Cards of {bankName}</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY CARDS</span>
              <span className="line"></span>
            </div>
            {/* Search Input with Icon */}
            <div className="d-flex pt-3 pb-4 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch /> {/* React Icon Search Icon */}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Bank Here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {cardsToShow.map((card, index) => (
            <div
              className={`col-md-3 fade-in ${loadingMore ? "loading" : ""}`} // Apply animation class conditionally
              key={card.CardName}
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <BankCardCard
                card={card}
                cityName={cityName}
                x
                cityID={cityID}
                bankName={bankName}
              />
            </div>
          ))}
        </div>
        {/* Only show "Load More" button if there are more banks to load */}
        {filteredCards.length > cardsToShow.length && (
          <div className="text-center mt-4">
            <button
              className="btn rabaat_login_btn"
              style={{ background: "transparent", color: "black" }}
              onClick={loadMore}
              disabled={isLoadMoreDisabled} // Disable button if all banks are loaded
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cards;
