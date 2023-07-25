import React from "react";

const CommentsContainer = ({ commentMessages }) => {
  return (
    <div
      style={{
        height: "85vh",
        width: "30vw",
        justifyContent: "space-between",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      {commentMessages.map((message, index) => (
        <p key={index} style={{ textAlign: "left", fontSize: "15px" }}>
          {message}
        </p>
      ))}
    </div>
  );
};

export default CommentsContainer;
