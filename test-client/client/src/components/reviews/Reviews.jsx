import React, { useState } from "react";
import "./reviews.css";

const Reviews = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      img: "../../../public/assets/img/review/5.png",
      name: "John Doe",
      rating: 5,
      review: "Amazing service! Highly recommended.",
    },
    {
      id: 2,
      img: "../../../public/assets/img/review/6.png",
      name: "Sarah Smith",
      rating: 4,
      review: "Great experience, will order again.",
    },
    {
      id: 3,
      img: "../../../public/assets/img/review/7.png",
      name: "Michael Lee",
      rating: 5,
      review: "Best quality ever! Totally worth it.",
    },
    {
      id: 4,
      img: "../../../public/assets/img/review/8.png",
      name: "Emily Brown",
      rating: 3,
      review: "Good service but a bit slow.",
    },
  ];

  const getClassName = (index) => {
    const length = reviews.length;
    if (index === currentCardIndex) return "center-card active";
    if (index === (currentCardIndex - 1 + length) % length) return "left-card active";
    if (index === (currentCardIndex + 1) % length) return "right-card active";
    return "";
    // const length = reviews.length;
    // if (index === currentCardIndex) return "center-card active";
    // if (index === (currentCardIndex - 1 + length) % length) return "left-card active";
    // if (index === (currentCardIndex + 1) % length) return "right-card active";
    // if (index === (currentCardIndex - 2 + length) % length) return "behind-left-card";
    // if (index === (currentCardIndex + 2) % length) return "behind-right-card";
    // return "hidden-card";
  };

  const prevSlide = () => {
    setCurrentCardIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextSlide = () => {
    setCurrentCardIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <div className="container mt-5">
        <h1 className="text-center">Latest Reviews</h1>
      <div className="slider-container position-relative d-flex justify-content-center align-items-center">
        <button className="prev_event" onClick={prevSlide}>&#10094;</button>
        <div className="slider_event d-flex justify-content-center align-items-center">
          {reviews.map((review, index) => (
            <div key={review.id} className={`car-item ${getClassName(index)}`}>
              <div className="review-card">
                <img src={review.img} className="review-img" alt={review.name} />
                <h5 className="review-name">{review.name}</h5>
                <div className="review-rating">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <h6 className="review-text">"{review.review}"</h6>
              </div>
            </div>
          ))}
        </div>
        <button className="next_event" onClick={nextSlide}>&#10095;</button>
      </div>
    </div>
  );
};

export default Reviews;
