import React, { useRef, useEffect } from "react";
import { handleMessageRole } from "../utils/GPTUtils";

const MessagesContainer = ({
  messages,
  height,
  weight,
  autoScroll,
  buttons,
  isLoading,
  jumpToMessageIndex,
  setJumpToMessageIndex,
  setCommentMessageHeight,
}) => {
  const containerRef = useRef(null);
  const messageRefs = useRef([]);

  useEffect(() => {
    if (containerRef.current) {
      if (autoScroll == true) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const buttonContainer =
        containerRef.current.querySelector(".button-container");

      if (buttonContainer) {
        const buttonWidths = buttonContainer.querySelectorAll("button");

        let accumulatedWidth = 0;
        buttonWidths.forEach((button) => {
          accumulatedWidth += button.offsetWidth;
          const position = containerWidth - accumulatedWidth - 5;
          button.style.right = `${position}px`;
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    if (
      jumpToMessageIndex !== null &&
      setJumpToMessageIndex &&
      messageRefs.current[jumpToMessageIndex]
    ) {
      messageRefs.current[jumpToMessageIndex].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (setCommentMessageHeight) {
        setTimeout(() => {
          const element = messageRefs.current[jumpToMessageIndex];
          const containerRect = containerRef.current.getBoundingClientRect();
          if (element) {
            const messageRect = element.getBoundingClientRect();
            const topDiff = messageRect.top - containerRect.top;

            setCommentMessageHeight(topDiff);
          }
        }, 500);
      }
      setJumpToMessageIndex(null);
    }
  }, [jumpToMessageIndex]);

  let filteredMessages = [];
  if (messages && messages.length > 0) {
    filteredMessages = messages.filter(
      (message, index) => message.role !== "system"
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        border: "1px solid #ccc",
        marginBottom: "20px",
        height: height,
        width: weight,
        padding: "10px",
        overflow: "auto",
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
        textAlign: "left",
        position: "relative",
      }}
    >
      {filteredMessages.map((message, index) => (
        <div
          key={index}
          className={`message ${handleMessageRole(message.role)}`}
          style={{
            position: "relative",
            paddingBottom: buttons ? "30px" : "0",
          }}
          ref={(el) => (messageRefs.current[index] = el)}
        >
          {message.content}
          <div
            className="button-container"
            style={{ position: "absolute", bottom: "5px", right: "5px" }}
          >
            {buttons &&
              buttons.map((button, buttonIndex) => (
                <button
                  key={buttonIndex}
                  onClick={() => button.onClick(index)}
                  disabled={isLoading}
                >
                  {isLoading ? "Wait" : button.label}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesContainer;
