import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { handleAPIRequest, handleMessageRole } from "../utils/GPTUtils";
import { UserContext } from "./UserContext";
import MessagesContainer from "./MessagesContainer";
import hint from "../images/hint.png";

function WriteStory() {
  const { token, char_type, char_name, where_is_char, setWriteStoryMsgCxt } =
    useContext(UserContext);
  const [inputText, setInputText] = useState("");
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hintMode, setHintMode] = useState(false);
  const [hintText, setHintText] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let msgs = messages;
      if (messages.length == 2) {
        setIsLoading(true);
        const apiResponse = await handleAPIRequest(token, msgs);
        setIsLoading(false);
        if (apiResponse !== "") {
          msgs = [...msgs, apiResponse];
        }
        setMessages(msgs);
      }
    };
    fetchData();
  }, [messages]);

  useEffect(() => {
    let msgs = messages;
    const systemRoleMessage = {
      role: "system",
      content: system_prompt,
    };
    const userBeginMessage = {
      role: "user",
      content: beginnings,
    };
    msgs = [systemRoleMessage, userBeginMessage];

    setMessages(msgs);
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const prompt_settings =
    "Act as a creative writing teacher who wants to help a 7-year-old student improve their reading and writing skills.";
  const length_requirement =
    "Everytime write 2 sentences that continue the story in a creative and funny way based on the user's input. Don't repeat user's input.\n";
  const style_requirement =
    "Let's play a collaborative writing game where we write an adventurous story together! You can use symbolism, metaphor, or imagery to make the story more interesting. \n";
  const purpose_requirement =
    "Remember to use age-appropriate vocabulary and correct punctuation and capitalization. Make sure the storyline is consistent and follow the kid's input. \n Avoid making big progress in the story and focus on giving more details. \n Let's see where our imaginations take us!";
  const consistent_requirement = "Continue the story user wrote.";
  const beginnings =
    "A " + char_type + " named " + char_name + " was " + where_is_char + ".";
  const hint_prompt =
    "Give me 3 directions with 1 simple sentence I can potentially continue this story.";

  const system_prompt =
    prompt_settings +
    style_requirement +
    length_requirement +
    purpose_requirement +
    consistent_requirement;

  const handleContinueStoryClick = async () => {
    let msgs = messages;
    if (msgs.length != 0 && inputText != "") {
      const userRoleMessage = {
        role: "user",
        content: inputText,
      };
      msgs = [...msgs, userRoleMessage];
    }
    setMessages(msgs);
    setInputText("");
    setIsLoading(true);
    const apiResponse = await handleAPIRequest(token, msgs);
    setIsLoading(false);
    if (apiResponse !== null) {
      msgs = [...msgs, apiResponse];
    }
    setMessages(msgs);
  };

  const handleRewriteStrotyClick = () => {
    navigate("/story-setting/");
  };

  const handleFinishStory = () => {
    console.log("[WriteStory] Finish Story");
    setWriteStoryMsgCxt(messages);
    navigate("/review-story/");
  };

  const handleHintClick = async () => {
    console.log("[WriteStory]Image clicked");
    setHintMode(true);
    let msgs = messages;
    if (msgs.length != 0) {
      const userRoleMessage = {
        role: "user",
        content: hint_prompt,
      };
      msgs = [...msgs, userRoleMessage];
    }
    setIsLoading(true);
    const apiResponse = await handleAPIRequest(token, msgs);
    setIsLoading(false);
    if (apiResponse !== null) {
      let hintText = ["Here are 3 suggestions for you: "];
      hintText = [...hintText, ...apiResponse.content.split("\n")];
      setHintText(hintText);
      console.log("got hint: ", apiResponse.content);
    }
  };

  const handleClosePopup = () => {
    setHintMode(false);
    setHintText([]);
  };

  return (
    <div
      style={{
        width: "90vw",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h3>Story To Be Continued</h3>
        <MessagesContainer
          messages={messages}
          height="40vh"
          autoScroll={true}
        />
      </div>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h3>Continue The Story</h3>
        <textarea
          style={{
            border: "1px solid #ccc",
            height: "20vh",
            padding: "10px",
            width: "90vh",
          }}
          value={inputText}
          onChange={handleInputChange}
          disabled={isLoading}
        ></textarea>
        <img
          src={hint}
          alt="hint"
          onClick={isLoading ? null : handleHintClick}
          style={{
            width: "40px",
            height: "60px",
            padding: "50px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        />
        {hintMode && (
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
                top: "45px",
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
              <p key={index} style={{ textAlign: "left" }}>
                {message}
              </p>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleContinueStoryClick} disabled={isLoading}>
          {isLoading ? "Wait" : "Continue Story"}
        </button>
        <button onClick={handleRewriteStrotyClick} disabled={isLoading}>
          {isLoading ? "Wait" : "Rewrite Story"}
        </button>
        <button onClick={handleFinishStory} disabled={isLoading}>
          {isLoading ? "Wait" : "Finish Story"}
        </button>
      </div>
    </div>
  );
}

export default WriteStory;
