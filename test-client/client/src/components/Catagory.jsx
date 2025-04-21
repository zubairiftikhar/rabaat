import { React, useEffect, useState } from "react";
import { fetchCategories } from "../services/api.js";
import CatagoryCard from "./CatagoryCard";
import Cookies from "js-cookie";
import "../css/categorycard.css";

const Catagory = () => {
  const [categories, setCategories] = useState([]);
  const cityName = Cookies.get("selectedCityName");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        // Create the "All" category and add it at the beginning
        const allCategory = { CategoryName: "All" };
        setCategories([allCategory, ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="container category_outer_conainer text-center">
      <h1>CATEGORIES</h1>
      <p>Find The Best Brand Discount Offers!</p>
      <div className="category-container">
        <div className="category-scroll">
          {categories.map((category, index) => (
            <CatagoryCard key={index} catagory={category} cityName={cityName} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catagory;