import React from "react";

const HintPopUp = ({ hintText, handleClosePopup }) => {
  return (
    <div className="hint-popup-container">
      <button
        className="close-button" 
        onClick={handleClosePopup}
      >
        X
      </button>
      {hintText.map((message, index) => (
        <p key={index} className="hint">
          {message}
        </p>
      ))}
    </div>
  );
};

export default HintPopUp;
