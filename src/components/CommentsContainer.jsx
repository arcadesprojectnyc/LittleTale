import React from "react";

const CommentsContainer = ({ commentMessages }) => {
  return (
    <div
      className="comments-container"
    >
      {commentMessages.map((message, index) => (
        <p key={index} className="comment">
          {message}
        </p>
      ))}
    </div>
  );
};

export default CommentsContainer;
