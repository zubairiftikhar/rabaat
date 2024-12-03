import React, { useEffect, useState } from "react";
import { fetchallBanks } from "../services/api";
import BankCard from "../components/BankCard";

const AllBanks = () => {
    const [allbanks, setBanks] = useState([]);

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
};
export default AllBanks