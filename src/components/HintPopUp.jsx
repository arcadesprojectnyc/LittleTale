import React from "react";

const HintPopUp = ({ hintText, handleClosePopup }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0c48c0",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 1,
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          cursor: "pointer",
          border: "solid",
          background: "#ffffff",
        }}
        onClick={handleClosePopup}
      >
        X
      </button>
      {hintText.map((message, index) => (
        <p key={index} style={{ textAlign: "left", fontSize: "15px" }}>
          {message}
        </p>
      ))}
    </div>
  );
};

export default HintPopUp;
