import React, { useEffect, useState } from "react";
import { fetchCities } from "../services/api";
import CityCard from "../components/CityCard";
import { FaSearch } from "react-icons/fa"; // Import the search icon from React Icons
import "./componentstyle.css";
import "../css/cityload.css";

const AllCities = () => {
  const [cities, setCities] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // State to track visible rows
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const getCities = async () => {
      try {
        const data = await fetchCities();
        console.log(data);
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getCities();
  }, []);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows after delay
      setLoadingMore(false); // End the animation
    }, 1000); // Delay in milliseconds
  };

  const filteredCities = cities.filter(
    (city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter cities by name
  );

  const citiesToShow = filteredCities.slice(0, visibleRows * 4); // 4 cities per row

  const isLoadMoreDisabled = citiesToShow.length >= filteredCities.length; // Disable if all cities are loaded

  return (
    <>
      <div className="container pt-5">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading pt-5">Cities</h1>
            <div className="side_border_dots pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY CITIES</span>
              <span className="line"></span>
            </div>
            {/* Search Input with Icon, aligned to the right */}
            <div className="d-flex pt-3 pb-4 page_search">
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <FaSearch /> {/* React Icon Search Icon */}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search City Here..."
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
          {citiesToShow.map((city, index) => (
            <div
              className={`col-md-3 fade-in ${loadingMore ? "loading" : ""}`} // Apply animation class conditionally
              key={city.id}
              style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
            >
              <CityCard city={city} />
            </div>
          ))}
        </div>
        {/* Only show "Load More" button if there are more cities to load */}
        {filteredCities.length > citiesToShow.length &&
          filteredCities.length > 8 && (
            <div className="text-center mt-4">
              <button
                className="btn btn" style={{backgroundColor: 'red', color: 'white'}}
                onClick={loadMore}
                disabled={isLoadMoreDisabled} // Disable button if all cities are loaded
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
      </div>
    </>
  );
};

export default AllCities;
