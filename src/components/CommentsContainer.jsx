import React from "react";

const CommentsContainer = ({ commentMessageHeight }) => {
  return (
    <div
      style={{
        height: "70vh",
        width: "30vw",
        justifyContent: "space-between",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      {commentMessageHeight && (
        <div style={{ paddingTop: commentMessageHeight }}>Hello World</div>
      )}
    </div>
  );
};

export default CommentsContainer;
