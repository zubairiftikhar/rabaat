import React, { useEffect, useState } from "react";
import { fetchCities } from "../services/api";
import CityCard from "../components/CityCard";
import './componentstyle.css';

const AllCities = () => {
    const [cities, setCities] = useState([]);

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
    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-12 col-sm">
                        <h1 className="main_heading pt-5">Cities</h1>
                        <div class="side_border_dots pt-3 pb-5">
                            <span class="line"></span>
                            <span class="text">LET'S DISCOVER BY CITIES</span>
                            <span class="line"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    {cities.map((city) => (
                        <div className="col-md-4" key={city.id}>
                            <CityCard city={city} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AllCities