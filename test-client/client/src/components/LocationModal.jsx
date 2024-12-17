import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchCities } from "../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LocationModal = ({ show, onClose, onCityChange }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
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

  const handleCityChange = (event) => {
    const cityId = parseInt(event.target.value, 10);
    const cityName = cities.find((city) => city.id === cityId)?.name;
    setSelectedCity({ id: cityId, name: cityName });
  };

  const handleProceed = () => {
    if (selectedCity) {
      onCityChange(selectedCity); // Optional callback
      onClose(); // Close the modal
      // Save the selected city to cookies
      Cookies.set("selectedCityId", selectedCity.id);
      Cookies.set("selectedCityName", selectedCity.name);
      // Navigate to the merchant page based on the city ID
      navigate(`/merchants/${selectedCity.id}`);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Your City</Modal.Title>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleProceed}
          disabled={!selectedCity}
        >
          Proceed
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationModal;
