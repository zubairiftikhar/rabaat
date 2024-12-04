import React, { useEffect, useState } from "react";
import { fetchallBanks } from "../services/api";
import BankCard from "../components/BankCard";
import "../css/cityload.css";

const AllBanks = () => {
  const [allbanks, setBanks] = useState([]);
  const [visibleRows, setVisibleRows] = useState(2); // State to track visible rows
  const [loadingMore, setLoadingMore] = useState(false); // State for animation delay

  useEffect(() => {
    const getAllBanks = async () => {
      try {
        const data = await fetchallBanks();
        console.log(data);
        setBanks(data);
      } catch (error) {
        console.error("Error fetching Banks:", error);
      }
    };
    getAllBanks();
  }, []);

  const loadMore = () => {
    setLoadingMore(true); // Start the animation
    setTimeout(() => {
      setVisibleRows((prevRows) => prevRows + 2); // Show 2 more rows after delay
      setLoadingMore(false); // End the animation
    }, 500); // Delay in milliseconds
  };

  const banksToShow = allbanks.slice(0, visibleRows * 3); // 3 banks per row

  return (
    <>
      <div className="container-fluid mt-5 bank_bg">
        <div className="row">
          <div className="col-lg-12 col-sm">
            <h1 className="main_heading_bank_landing pt-5">Banks</h1>
            <div className="side_border_dots_bank_landing pt-3 pb-5">
              <span className="line"></span>
              <span className="text">LET'S DISCOVER BY BANKS</span>
              <span className="line"></span>
<<<<<<< HEAD
            </div>
            <div className="container">
              <div className="row">
                {banksToShow.map((bank, index) => (
                  <div
                    className={`col-md-4 fade-in ${
                      loadingMore ? "loading" : ""
                    }`} // Apply animation class conditionally
                    key={bank.id}
                    style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
                  >
                    <BankCard bank={bank} />
                  </div>
                ))}
              </div>
              {banksToShow.length < allbanks.length && ( // Show button if more banks are available
                <div className="text-center mt-4">
                  <button className="btn btn-primary" onClick={loadMore}>
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
    useEffect(() => {
        const getAllBanks = async () => {
            try {
                const data = await fetchallBanks();
                console.log(data);
                setBanks(data);
            } catch (error) {
                console.error("Error fetching Banks:", error);
            }
        };
        getAllBanks();
    }, []);
    return (
        <>
            <div className="container-fluid mt-5 bank_bg">
                <div className="row">
                    <div className="col-lg-12 col-sm">
                        <h1 className="main_heading_bank_landing pt-5">Banks</h1>
                        <div class="side_border_dots_bank_landing pt-3 pb-5">
                            <span class="line"></span>
                            <span class="text">LET'S DISCOVER BY BANKS</span>
                            <span class="line"></span>
                        </div>
                        <div className="container">
                            <div className="row">
                                {allbanks.map((bank) => (
                                    <div className="col-md-3" key={bank.id}>
                                        <BankCard bank={bank} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
=======
            </div>
            <div className="container">
              <div className="row">
                {banksToShow.map((bank, index) => (
                  <div
                    className={`col-md-3 fade-in ${
                      loadingMore ? "loading" : ""
                    }`} // Apply animation class conditionally
                    key={bank.id}
                    style={{ animationDelay: `${index * 0.1}s` }} // Stagger animation
                  >
                    <BankCard bank={bank} />
                  </div>
                ))}
              </div>
              {banksToShow.length < allbanks.length && ( // Show button if more banks are available
                <div className="text-center mt-4">
                  <button className="btn btn-primary" onClick={loadMore}>
                    {loadingMore ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
>>>>>>> uidev
};

export default AllBanks;
