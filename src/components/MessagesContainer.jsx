import React, { useRef, useEffect, useState } from "react";
import { handleMessageRole } from "../utils/GPTUtils";

const MessagesContainer = ({
  messages,
  height,
  width,
  autoScroll,
  buttons,
  isLoading,
  jumpToMessageIndex,
  setJumpToMessageIndex,
  setCommentMessageHeight,
  editMessageIndex,
  setEditMessageIndex,
  setEditedMessage,
}) => {
  const containerRef = useRef(null);
  const messageRefs = useRef([]);
  const [editMessage, setEditMessage] = useState("");

  const adjustButtonsPosition = () => {
    console.log("MSGCTN: adjBtns");
    if (containerRef.current) {
      console.log("MSGCTN: containerRef");

      const containerWidth = containerRef.current.offsetWidth;
      const buttonContainer =
        containerRef.current.querySelector(".button-container");

      if (buttonContainer) {
        console.log("MSGCTN: buttonContainer: ", buttonContainer);

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
    jumpToIndex(jumpToMessageIndex);
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
    if (setJumpToMessageIndex) {
      setJumpToMessageIndex(null);
    }
  }, [jumpToMessageIndex]);

  let filteredMessages = [];
  if (messages && messages.length > 0) {
    filteredMessages = messages.filter(
      (message, index) => message.role !== "system"
    );
  }

  const handleEditOnChange = (event) => {
    setEditMessage(event.target.value);
  };

  const handleEditCancel = () => {
    if (setEditMessageIndex != null) {
      setEditMessageIndex(null);
      setEditMessage("");
    }
  };

  const handleEditSave = () => {
    if (editMessage !== "" && setEditedMessage) {
      setEditedMessage(editMessage);
      setEditMessage("");
    } else if (setEditMessageIndex != null) {
      setEditMessageIndex(null);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        border: "1px solid #ccc",
        marginBottom: "20px",
        height: height,
        width: width,
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
          {editMessageIndex == index ? (
            // Render the input field with the message content
            <textarea
              value={editMessage}
              style={{
                height: "20vh",
                width: "99%",
              }}
              onChange={handleEditOnChange}
            />
          ) : (
            // Render the message content
            <div>{message.content}</div>
          )}

          <div
            className="button-container"
            style={{ position: "absolute", bottom: "5px", right: "5px" }}
          >
            {editMessageIndex == index && (
              <>
                <button onClick={handleEditCancel}>Cancel</button>
                <button onClick={handleEditSave}>Save</button>
              </>
            )}
            {buttons &&
              (editMessageIndex == null || editMessageIndex != index) &&
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
