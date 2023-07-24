import React from "react";

const CommentsContainer = ({ commentMessageHeight, commentMessages }) => {
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
      {commentMessageHeight && (
        <>
          <div style={{ height: commentMessageHeight }}></div>
          <div
            style={{
              height: `calc(100% - ${commentMessageHeight}px)`,
              overflow: "auto",
            }}
          >
            {commentMessages.map((message, index) => (
              <p key={index} style={{ textAlign: "left", fontSize: "15px" }}>
                {message}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsContainer;
