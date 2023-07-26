import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { handleAPIRequest } from "../utils/GPTUtils";
import { UserContext } from "./UserContext";
import MessagesContainer from "./MessagesContainer";
import hint from "../images/hint.png";
import HintPopUp from "./HintPopUp";

function WriteStory() {
  const { token, beginning, write_story_msgs, setWriteStoryMsgCxt } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hintMode, setHintMode] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [hintText, setHintText] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();

  // This is to avoid the double calling gpt api in dev mode, due to react new feature.
  useEffect(() => {
    if (messages.length == 2) {
      let msgs = messages;
      callGPTApi(msgs);
    }
  }, [messages]);

  useEffect(() => {
    if (write_story_msgs.length == 0) {
      let msgs = messages;
      const systemRoleMessage = {
        role: "system",
        content: system_prompt,
      };
      const userBeginMessage = {
        role: "user",
        content: beginning,
      };
      msgs = [systemRoleMessage, userBeginMessage];
      setMessages(msgs);
    } else {
      const userEditMsg = {
        role: "user",
        content: "",
      };
      setMessages([...write_story_msgs, userEditMsg]);
      setEditIndex(write_story_msgs.length - 1);
    }
  }, []);

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

  const callGPTApi = async (msgs) => {
    setIsLoading(true);
    const apiResponse = await handleAPIRequest(token, msgs);
    setIsLoading(false);
    const userEditMsg = {
      role: "user",
      content: "",
    };
    if (apiResponse !== null) {
      msgs = [...msgs, apiResponse, userEditMsg];
    } else {
      msgs = [...msgs, userEditMsg];
    }
    setMessages(msgs);
    setAutoScroll(true);
    setEditIndex(msgs.length - 2);
  };

  const handleContinueStoryClick = async (msg) => {
    setEditIndex(null);
    let msgs = messages.slice(0, -1); // without the last append input box
    if (msgs.length != 0) {
      const userRoleMessage = {
        role: "user",
        content: msg,
      };
      msgs = [...msgs, userRoleMessage];
    }
    setMessages(msgs);
    callGPTApi(msgs);
  };

  const handleRewriteStrotyClick = () => {
    navigate("/story-setting/");
  };

  const handleFinishStory = () => {
    console.log("[WriteStory] Finish Story");
    setWriteStoryMsgCxt(messages.slice(0, -1));
    navigate("/review-story/");
  };

  const handleHintClick = async (msg) => {
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

  const handleDeleteMsg = (deleteIndex) => {
    // The index 0 is for system in messages, not displayed on UI.
    const updatedMsgs = messages.filter(
      (_, index) => index !== deleteIndex + 1
    );
    setAutoScroll(false);
    setEditIndex(updatedMsgs.length - 2);
    setMessages(updatedMsgs);
  };

  const buttons = [
    {
      label: "Delete",
      onClick: handleDeleteMsg,
    },
    {
      role: "edit",
      label: "Hint",
      onClick: handleHintClick,
    },
    {
      role: "edit",
      label: "AI Continue",
      onClick: handleContinueStoryClick,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Need to change</h3>
        <div>
          <button
            style={{ right: "10px" }}
            onClick={handleRewriteStrotyClick}
            disabled={isLoading}
          >
            {isLoading ? "Wait" : "Rewrite Story"}
          </button>
          <button onClick={handleFinishStory} disabled={isLoading}>
            {isLoading ? "Wait" : "Finish Story"}
          </button>
        </div>

        <MessagesContainer
          messages={messages}
          height="85vh"
          autoScroll={autoScroll}
          buttons={buttons}
          editMessageIndex={editIndex}
        />
      </div>
      {hintMode && (
        <HintPopUp
          hintText={hintText}
          handleClosePopup={handleClosePopup}
        ></HintPopUp>
      )}
    </div>
  );
}
export default WriteStory;
