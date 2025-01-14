import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { fetchCities } from "../services/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Dropdown } from "react-bootstrap";
import City from "../../public/assets/img/landing/city.png";
import { FaSearch } from "react-icons/fa"; // Import icon for search
import "../css/locationmodal.css";

const LocationModal = ({ show, onClose, onCityChange }) => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const navigate = useNavigate();

  useEffect(() => {
    const getCities = async () => {
      try {
        const data = await fetchCities();
        setCities(data);
        setFilteredCities(data); // Initially, show all cities
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getCities();
  }, []);

  // Handle the search input change inside the dropdown
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter cities based on the search query
    if (query) {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities); // Reset the list if search is cleared
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city); // Set selected city from the filtered list
    setSearchQuery(""); // Clear search field
  };

  const handleProceed = () => {
    if (selectedCity) {
      onCityChange(selectedCity); // Optional callback
      onClose(); // Close the modal
      // Save the selected city to cookies
      Cookies.set("selectedCityId", selectedCity.id);
      Cookies.set("selectedCityName", selectedCity.name);
      // Navigate to the merchant page based on the city ID
      navigate(`/${selectedCity.name}?CityID=${selectedCity.id}`);
    }
  };
  const gradientStyle = {
    background:
      "linear-gradient(294deg, rgba(232,84,83,1) 23%, rgba(253,42,78,1) 79%)",
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="md"
      style={{ borderRadius: "25px" }}
      className="custom_modal"
    >
      <div className="div_modal">
        <Modal.Header>
          {/* remove the closeButton from header for removing x on modal */}
          <Modal.Title className="modal_heading">Select Your City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" className="w-100 py-3">
                <img src={City} className="me-1" alt="" />
                {selectedCity ? selectedCity.name : "Choose City"}
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100 dropdown-menu-scrollable">
                {/* Search Field inside the dropdown */}
                <div className="px-3 py-2">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <FaSearch
                          style={{
                            fontSize: "23px",
                            height: "100%",
                            lineHeight: "32px",
                          }}
                        />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Search by city name"
                      value={searchQuery}
                      onChange={handleSearchChange} // Trigger the search on change
                    />
                  </div>
                </div>

                {/* City options filtered based on search query */}
                {filteredCities.length === 0 ? (
                  <Dropdown.Item disabled>No cities found</Dropdown.Item>
                ) : (
                  filteredCities.map((city) => (
                    <Dropdown.Item
                      key={city.id}
                      as="button"
                      onClick={() => handleCityChange(city)} // Select city
                      className="city-option"
                    >
                      {city.name}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="rabaat_proc_city_btn"
            onClick={handleProceed}
            disabled={!selectedCity}
          >
            <span>Proceed</span>
          </button>
          <button className="rabaat_cls_city_btn ms-3" onClick={onClose}>
            <span>Close</span>
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default LocationModal;
