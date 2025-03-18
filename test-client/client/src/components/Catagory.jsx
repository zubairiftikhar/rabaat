import { React, useEffect, useState } from "react";
import { fetchCategories } from "../services/api.js";
import CatagoryCard from "./CatagoryCard";
import Cookies from "js-cookie";
import "../css/categorycard.css"; // Ensure styles are included

const Catagory = () => {
  const [categories, setCategories] = useState([]);
  const cityName = Cookies.get("selectedCityName");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="container category_outer_conainer text-center">
        <h1>Categories</h1>
        <p>Find everything you need across a variety of exciting categories!</p>
      <div className="category-container">
        <div className="category-scroll">
          {categories.map((category, index) => (
            <CatagoryCard key={index} catagory={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catagory;
