import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchBanksByCityName } from "../services/api";
import BankCard from "../components/BankCard";
import SkeletonBankCard from "../components/SkeletonBankCard";
import "../components/mainsecsearch/mainsecsearch.css";
import "../css/cityload.css";

const Banks = () => {
  const { cityName } = useParams();
  const [banks, setBanks] = useState([]);
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleBanks, setVisibleBanks] = useState(12); // Default for desktop
  const [banksPerRow, setBanksPerRow] = useState(6); // Default for desktop
  const sliderRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityIdFromQuery = queryParams.get("CityID");
    setCityId(cityIdFromQuery);
  }, [location]);

  useEffect(() => {
    setLoading(true);
    const getBanks = async () => {
      try {
        const data = await fetchBanksByCityName(cityName);
        setBanks(data);
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };
    getBanks();
  }, [cityName]);

  // Adjust banks per row based on screen width
  useEffect(() => {
    const updateBanksPerRow = () => {
      if (window.innerWidth < 992) {
        setBanksPerRow(3); // Mobile: 3 banks per row
        setVisibleBanks(6); // Show 2 rows initially (3 per row)
      } else {
        setBanksPerRow(6); // Desktop: 6 banks per row
        setVisibleBanks(12); // Show 2 rows initially (6 per row)
      }
    };

    updateBanksPerRow();
    window.addEventListener("resize", updateBanksPerRow);
    return () => window.removeEventListener("resize", updateBanksPerRow);
  }, []);

  // Filtered banks based on search query
  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load More function to display additional rows
  const loadMore = () => {
    setVisibleBanks((prevVisible) => prevVisible + banksPerRow * 2); // Load 2 more rows
  };

  return (
    <>
      <div className="card_outer_conainer">
        <div className="container">
          <div className="row text-center shopcontainerw85">
            <h1>BANKS</h1>
            <p>Find The Best Discount Offers On Your Bank Card!</p>

            {loading ? (
              <div className="row">
                {[...Array(banksPerRow * 2)].map((_, index) => (
                  <div key={index} className="col-lg-2 col-md-4 col-sm-4 mb-4">
                    <SkeletonBankCard />
                  </div>
                ))}
              </div>
            ) : (
              <div className="row pt-4">
                {filteredBanks.slice(0, visibleBanks).map((bank) => (
                  <div className="col-lg-2 col-md-4 col-4 mb-4" key={bank.id}>
                    <BankCard bank={bank} cityId={cityId} cityName={cityName} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {visibleBanks < filteredBanks.length && (
            <div className="text-center mt-3">
              <button className="rabaat_login_btn" onClick={loadMore}>
                <span>Load More</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Banks;
