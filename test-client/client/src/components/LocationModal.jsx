import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchCities, fetchBanksByCity } from "../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LocationModal = ({ show, onClose, onCityBankChange }) => {
  const [cities, setCities] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getCities();
  }, []);

  const handleCityChange = async (event) => {
    const cityId = parseInt(event.target.value, 10);
    const cityName = cities.find((city) => city.id === cityId)?.name;
    setSelectedCity({ id: cityId, name: cityName });

    try {
      const data = await fetchBanksByCity(cityId);
      setBanks(data);
      setSelectedBank(null);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleBankChange = (event) => {
    const bankId = parseInt(event.target.value, 10);
    const bankName = banks.find((bank) => bank.id === bankId)?.name;
    setSelectedBank({ id: bankId, name: bankName });
  };

  const handleProceed = () => {
    if (selectedCity && selectedBank) {
      onCityBankChange(selectedCity, selectedBank); // Optional callback
      onClose(); // Close the modal
      // Navigate using bank.id and city.id in the URL
      Cookies.set("selectedCityId", selectedCity.id);
      Cookies.set("selectedCityName", selectedCity.name);
      Cookies.set("selectedBankId", selectedBank.id);
      Cookies.set("selectedBankName", selectedBank.name);
      navigate(`/merchants/${selectedBank.id}/${selectedCity.id}`);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Your Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="cityDropdown" className="form-label">
            Select City
          </label>
          <select
            id="cityDropdown"
            className="form-select"
            onChange={handleCityChange}
            value={selectedCity?.id || ""}
          >
            <option value="" disabled>
              -- Choose City --
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="bankDropdown" className="form-label">
            Select Bank
          </label>
          <select
            id="bankDropdown"
            className="form-select"
            onChange={handleBankChange}
            value={selectedBank?.id || ""}
            disabled={!selectedCity}
          >
            <option value="" disabled>
              -- Choose Bank --
            </option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleProceed}
          disabled={!selectedCity || !selectedBank}
        >
          Proceed
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationModal;
