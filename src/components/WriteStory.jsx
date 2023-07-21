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
      content: beginning_prompt,
    };
    msgs = [systemRoleMessage, userBeginMessage];

    setMessages(msgs);
  }, []);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Prompt for setting up the story game
  const prompt_settings =
    "You are a creative writing teacher who is eager to help a 7-year-old student enhance their reading and writing skills through an exciting collaborative writing game.";
  const story_style_requirement =
    "The game involves both the teacher (that's you!) and the student taking turns to write an adventurous story together. Here are the rules to follow: \n";
  const story_hard_requirement_1 =
    "1. Use symbolism, metaphor, and imagery to make the story captivating and engaging for the young reader.\n";
  const story_hard_requirement_2 =
    "2. Maintain age-appropriate vocabulary and ensure correct punctuation and capitalization throughout the story.\n";
  const story_hard_requirement_3 =
    "3. Ensure the storyline remains consistent and incorporates the kid's input in a creative and humorous manner.\n";
  const story_hard_requirement_4 =
    "4. Avoid repeating the child's input. Instead, progress the story gradually while providing additional details. \n";
  const story_length_requirement =
    "5. Keep your responses concise, using no more than 50 words each time.\n Let's embark on this storytelling adventure and create a magical world together!";

  const system_prompt =
    prompt_settings +
    story_style_requirement +
    story_hard_requirement_1 +
    story_hard_requirement_2 +
    story_hard_requirement_3 +
    story_hard_requirement_4 +
    story_length_requirement;

  const beginning_prompt =
    "A " + char_type + " named " + char_name + " was " + where_is_char + "."; //TODO: Need to replace this with user_input_beginnings + ".";

  // Prompt for Hints
  const hint_request =
    "I've reached a point in the game where I'm unsure how to proceed with the story. Could you please provide 3 potential directions that I can take with some guiding questions to help me explore each option further?";
  const hint_hard_requirment =
    "Remember to consider the story so far and make the questions engaging and thought-provoking.  To make it more engaging and thought-provoking, please continue to use a teacher's tone.";
  const hint_length_requirement =
    "Keep your responses concise, using no more than 60 words each time.";
  const hint_beginning_requirement =
    "Begin with 'Here are some hints to continue our story.'";

  const hint_prompt =
    hint_request +
    hint_hard_requirment +
    hint_length_requirement +
    hint_beginning_requirement;

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
    if (apiResponse !== null && apiResponse.content !== null) {
      let hintText = [""]; // We don't need this beginning any more. gpt will give customized beginnings
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
        <div style={{ display: "flex" }}>
          <textarea
            style={{
              border: "1px solid #ccc",
              height: "20vh",
              padding: "10px",
              width: "90%",
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
              paddingTop: "7vh",
              paddingLeft: "5vh",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          />
        </div>
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
