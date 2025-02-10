import React from "react";
import "../css/loader.css"; // Import loader CSS
import LoadRabit from '../../public/assets/img/landing/load_rabbit.gif'

const Loader = () => {
  return (
    <div className="custom-loader">
      <div className="loader-icon"> <img src={LoadRabit} alt="Loading..." /> </div>
    </div>
  );
};

export default Loader;
