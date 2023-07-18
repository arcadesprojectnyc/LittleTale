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
    "Rewrite the last message content based on the context, so that the rewrite message can fit in the context with more imagination.\n";
  const style_requirement =
    "Let's play the collaborative writing improvement training where we write an adventurous story together! You can use symbolism, metaphor, or imagery to make the story more interesting. \n";
  const purpose_requirement =
    "Remember to use age-appropriate vocabulary and correct punctuation and capitalization. Make sure the storyline is consistent and follow the kid's input. \n Avoid making big progress in the story and focus on giving more details. \n Let's see where our imaginations take us!";
  const consistent_requirement =
    "Make sure the rewrite story fits in the original context where it came from. Do not use following meesage content for rewrite. And only return the revised version content";

  const system_prompt =
    prompt_settings +
    style_requirement +
    action_requirement +
    purpose_requirement +
    consistent_requirement;

  const handleStartWriting = () => {
    navigate("/story-setting/");
  };

  const handleRewriteMsg = async (index) => {
    console.log("handleCorrectMsg:", index);
    let ctn = "Rewrite: " + write_story_msgs[index + 1].content;
    let msgs = messages;
    const userRoleMessage = {
      role: "user",
      content: ctn,
    };
    msgs = [...msgs, userRoleMessage];
    setIsLoading(true);
    const apiResponse = await handleAPIRequest(token, msgs);
    setIsLoading(false);
    if (apiResponse !== "") {
      msgs = [...msgs, apiResponse];
      // The index passed in with no system msg, so plus 1 back
      msgs[index + 1] = apiResponse;
      console.log(msgs);
    }
    setMessages(msgs);
  };

  const handleEditMsg = (index) => {
    console.log("ReviewStory: handle edit msg: ", index);
    setJumpToMessageIndex(index);
  };

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
      label: "Comment",
      onClick: handleRewriteMsg,
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
        <CommentsContainer commentMessageHeight={commentMessageHeight} />
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