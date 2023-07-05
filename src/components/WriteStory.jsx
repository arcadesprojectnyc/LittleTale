import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { handleAPIRequest, handleMessageRole } from "../utils/GPTUtils";
import { UserContext } from "./UserContext";

function WriteStory() {
  const { token, char_type, char_name, where_is_char, setWriteStoryMsgCxt } =
    useContext(UserContext);
  const [inputText, setInputText] = useState("");
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
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

      setIsLoading(true);
      const apiResponse = await handleAPIRequest(token, msgs);
      setIsLoading(false);

      if (apiResponse !== "") {
        msgs = [...msgs, apiResponse];
      }
      setMessages(msgs);
    };

    fetchData();
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
    if (apiResponse !== "") {
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

  const filteredMessages = messages.filter(
    (message) => message.role !== "system"
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Story To Be Continued</h3>
        <div
          ref={messageContainerRef}
          style={{
            border: "1px solid #ccc",
            marginBottom: "20px",
            height: "40vh",
            width: "90vh",
            padding: "10px",
            overflow: "auto",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
            textAlign: "left",
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${handleMessageRole(message.role)}`}
            >
              {message.content}
            </div>
          ))}
        </div>
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
