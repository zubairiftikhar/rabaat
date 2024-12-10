import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchCities } from "../services/api"; // API to fetch cities
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const CityModal = ({ show, onSelectCity, onClose }) => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

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

  // Handle city click: store in session and navigate
  const handleCityClick = (city) => {
    // Store city name and ID in session storage
    sessionStorage.setItem("selectedCityId", city.id);
    sessionStorage.setItem("selectedCityName", city.name);

    // Call the parent function to update the current city
    onSelectCity(city);

    // Navigate to the Banks page with cityId
    navigate(`/banks/${city.id}`);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Your City</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
          {cities.map((city) => (
            <li
              key={city.id}
              className="list-group-item"
              onClick={() => handleCityClick(city)} // Call handleCityClick on click
              style={{ cursor: "pointer" }}
            >
              {city.name}
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CityModal;
