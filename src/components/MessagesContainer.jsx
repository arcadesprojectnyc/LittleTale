import React, { useRef, useEffect, useState } from "react";
import { handleMessageRole } from "../utils/GPTUtils";

const MessagesContainer = ({
  messages,
  height,
  width,
  autoScroll,
  buttons,
  isLoading,
  reviewMessageIndex,
  editMessageIndex,
}) => {
  const containerRef = useRef(null);
  const messageRefs = useRef([]);
  const [editMessage, setEditMessage] = useState("");

  const adjustButtonsPosition = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const buttonContainer =
        containerRef.current.querySelector(".button-container");

      if (buttonContainer) {
        const buttons = buttonContainer.querySelectorAll("button");
        let accumulatedWidth = 0;
        buttons.forEach((button) => {
          accumulatedWidth += button.offsetWidth;
          const position = containerWidth - accumulatedWidth - 5;
          button.style.right = `${position}px`;
        });
      }
    }
  };

  useEffect(() => {
    if (containerRef.current && autoScroll == true) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    adjustButtonsPosition();
  }, [messages]);

  const jumpToIndex = (jumpIndex) => {
    if (jumpIndex !== null && messageRefs.current[jumpIndex]) {
      messageRefs.current[jumpIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    jumpToIndex(editMessageIndex);
    if (
      editMessageIndex !== null &&
      filteredMessages.length > editMessageIndex
    ) {
      console.log(filteredMessages);
      setEditMessage(filteredMessages[editMessageIndex].content);
    }
  }, [editMessageIndex]);

  useEffect(() => {
    jumpToIndex(reviewMessageIndex);
  }, [reviewMessageIndex]);

  let filteredMessages = [];
  if (messages && messages.length > 0) {
    filteredMessages = messages.filter(
      (message, index) => message.role !== "system"
    );
  }

  const handleEditOnChange = (event) => {
    setEditMessage(event.target.value);
  };

  return (
    <div
      ref={containerRef}
      className="custom-message-container"
      style={{
        height: height,
        width: width,
      }}
    >
      {filteredMessages.map((message, index) => (
        <div
          key={index}
          className={`${handleMessageRole(message.role)}`}
          style={{
            position: "relative",
            paddingBottom: buttons ? "30px" : "0",
          }}
          ref={(el) => (messageRefs.current[index] = el)}
        >
          {editMessageIndex == index ? (
            // Render the input field with the message content
            <textarea
              value={editMessage}
              className="message-textarea"
              onChange={handleEditOnChange}
            />
          ) : (
            // Render the message content
            <div>{message.content}</div>
          )}
          <div
            style={{
              marginTop: "5px",
              marginBottom: "5px",
              position: "absolute",
              right: "5px",
            }}
          >
            {editMessageIndex == index &&
              buttons &&
              buttons.map(
                (button, buttonIndex) =>
                  button.role == "edit" && (
                    <button
                      key={buttonIndex}
                      onClick={() => button.onClick(editMessage)}
                      disabled={isLoading}
                      className={`message-hintpost-button ${isLoading ? 'message-hintpost-disabled' : ''}`}
                    >
                      {isLoading ? "Loading" : button.label}
                    </button>
                  )
              )}
            {buttons &&
              (editMessageIndex == null || editMessageIndex != index) &&
              buttons.map(
                (button, buttonIndex) =>
                  (button.role == null || button.role == message.role) && (
                    <button
                      key={buttonIndex}
                      onClick={() => button.onClick(index)}
                      disabled={isLoading}
                      className={`message-button ${isLoading ? 'message-button-disabled' : ''}`}
                    >
                      {isLoading ? "Loading" : button.label}
                    </button>
                  )
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesContainer;
