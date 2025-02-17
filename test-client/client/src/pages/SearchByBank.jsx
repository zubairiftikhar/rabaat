import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { fetchallBanks, getCardsByBank } from "../services/api";
import "../css/SearchByBank.css";

const SearchByBank = () => {
  const { cityName, cityID } = useParams();

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate(); // React Router navigation hook

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const bankData = await fetchallBanks();
        setBanks(
          bankData.map((bank) => ({
            value: bank.name,
            label: (
              <div className="option-content">
                <span className="option-text">{bank.name}</span>
                <img
                  src={`/assets/img/banks/${bank.image}`}
                  alt={bank.BankName}
                  className="option-image"
                />
              </div>
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    loadBanks();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      setSelectedCard(null); // Reset selected card when bank changes

      const loadCards = async () => {
        try {
          const cardData = await getCardsByBank(selectedBank.value);
          setCards(
            cardData.map((card) => ({
              value: card.CardID,
              label: (
                <div className="option-content">
                  <span className="option-text">{card.CardName}</span>
                  <img
                    src={`/assets/img/cards/${card.image_path}`}
                    alt={card.CardName}
                    className="option-image"
                  />
                </div>
              ),
            }))
          );
        } catch (error) {
          console.error("Error fetching cards:", error);
        }
      };
      loadCards();
    } else {
      setCards([]);
      setSelectedCard(null);
    }
  }, [selectedBank]);

  // Handle Proceed button click
  const handleProceed = () => {
    if (selectedBank && selectedCard) {
      const bankName = selectedBank.label.props.children[0].props.children
        .toLowerCase()
        .replace(/\s+/g, "-"); // Convert bank name to URL-friendly format
      const cardName = selectedCard.label.props.children[0].props.children
        .toLowerCase()
        .replace(/\s+/g, "-"); // Convert card name to URL-friendly format

      // Include cityID as a query parameter
      navigate(`/${cityName}/${bankName}/${cardName}/${cityID}`); // Navigate to the new URL
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-title">Search by Bank</h2>
      <div className="dropdown-container">
        <label>Select Bank:</label>
        <Select
          options={banks}
          value={selectedBank}
          onChange={setSelectedBank}
          placeholder="-- Select a Bank --"
          className="custom-select"
        />
      </div>
      <div className="dropdown-container">
        <label>Select Card:</label>
        <Select
          options={cards}
          value={selectedCard}
          onChange={setSelectedCard}
          placeholder="-- Select a Card --"
          isDisabled={!selectedBank || cards.length === 0}
          className="custom-select"
        />
      </div>
      <button
        className="proceed-btn"
        onClick={handleProceed}
        disabled={!selectedBank || !selectedCard}
      >
        Proceed
      </button>
    </div>
  );
};

export default SearchByBank;
