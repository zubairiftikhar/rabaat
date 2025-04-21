import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/card.css";

const CatagoryCard = ({ catagory, cityName }) => {
  const navigate = useNavigate();
  const replaceSpacesWithUnderscore = (name) => name.replace(/\s+/g, "_");

  const formatCategoryImageName = (categoryName) => {
    return categoryName.trim().toLowerCase().replace(/\s+/g, "_") + ".jpg";
  };

  const handleCategoryClick = () => {
    navigate(`/${cityName}/Category/${replaceSpacesWithUnderscore(catagory.CategoryName)}`);
  };

  // Determine the image source
  const getImageSource = () => {
    if (catagory.CategoryName === "All") {
      // Use a default "all" image or any other image for the "All" category
      return "../../../public/assets/img/categories/all.jpg";
    }
    return `../../../public/assets/img/categories/${formatCategoryImageName(catagory.CategoryName)}`;
  };

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <img src={getImageSource()} alt={catagory.CategoryName} className="category-image" />
      <h2 className="category-title offer-title">{catagory.CategoryName}</h2>
    </div>
  );
};

export default CatagoryCard;