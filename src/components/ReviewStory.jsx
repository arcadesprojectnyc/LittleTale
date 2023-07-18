import React, { useRef, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { handleAPIRequest, handleMessageRole } from "../utils/GPTUtils";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import MessagesContainer from "./MessagesContainer";
import CommentsContainer from "./CommentsContainer";

function ReviewStory() {
  const { token, write_story_msgs } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [jumpToMessageIndex, setJumpToMessageIndex] = useState(null);
  const [commentMessageHeight, setCommentMessageHeight] = useState(null);
  const [messages, setMessages] = useState(write_story_msgs);
  const [commentMessages, setCommentMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const resetSystem = () => {
      if (write_story_msgs && write_story_msgs.length > 0) {
        const systemRoleMessage = {
          role: "system",
          content: system_prompt,
        };
        const updatedMsgs = [
          systemRoleMessage,
          ...messages.slice(1), // Copy the remaining elements from the original array
        ];
        setMessages(updatedMsgs);
      }
    };
    resetSystem();
  }, []);

  const prompt_settings =
    "Act as a creative writing teacher who improves a 7-year-old student writing skills.";
  const action_requirement =
    "Provide 3 writing improvement suggestions, like writing details, vocabulary and grammar.\n";
  const purpose_requirement =
    "Focus on the last message from user only. Only include the direct recommendation.";

  const system_prompt =
    prompt_settings + action_requirement + purpose_requirement;

  const handleStartWriting = () => {
    navigate("/story-setting/");
  };

  const handleMsgRecommendation = async (index) => {
    console.log("ReviewStory: handle edit msg: ", index);
    setCommentMessages([]);
    setJumpToMessageIndex(index);

    let msgs = messages;
    const userRoleMessage = {
      role: "user",
      content:
        //"Provide 3 grammar and vocabulary improvement suggestions: " +
        write_story_msgs[index + 1].content,
    };
    msgs = [...msgs, userRoleMessage];
    setIsLoading(true);
    const apiResponse = await handleAPIRequest(token, msgs);
    setIsLoading(false);
    if (apiResponse !== "") {
      msgs = [...msgs, apiResponse];
      // The index passed in with no system msg, so plus 1 back
      setCommentMessages(apiResponse.content.split("\n"));
    }
    setMessages(msgs);
  };

  const handleEditMsg = (index) => {};

  const saveToFile = () => {
    const formattedMessages = JSON.stringify(messages, null, 2);
    const blob = new Blob([formattedMessages], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "messages.json");
  };

  let filteredMessages = [];
  if (messages && messages.length > 0) {
    filteredMessages = messages.filter(
      (message, index) => index > 0 && index < write_story_msgs.length
    );
  }

  const buttons = [
    {
      label: "Recommendation",
      onClick: handleMsgRecommendation,
    },
    {
      label: "Edit",
      onClick: handleEditMsg,
    },
  ];

  return (
    <div
      style={{
        width: "90vw",
      }}
    >
      <h3>The Story</h3>
      <div
        style={{
          display: "flex",
          width: "90vw",
        }}
      >
        <MessagesContainer
          messages={filteredMessages}
          height="70vh"
          weight="70vw"
          autoScroll={false}
          buttons={buttons}
          isLoading={isLoading}
          jumpToMessageIndex={jumpToMessageIndex}
          setJumpToMessageIndex={setJumpToMessageIndex}
          setCommentMessageHeight={setCommentMessageHeight}
        />
        <CommentsContainer
          commentMessageHeight={commentMessageHeight}
          commentMessages={commentMessages}
        />
      </div>
      <div>
        <button onClick={saveToFile} disabled={isLoading}>
          {isLoading ? "Wait" : "Save Story"}
        </button>
        <button onClick={handleStartWriting} disabled={isLoading}>
          {isLoading ? "Wait" : "Start Writing Again"}
        </button>
      </div>
    </div>
  );
}
export default ReviewStory;
