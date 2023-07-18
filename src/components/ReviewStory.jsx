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

  const prompt_settings ="You are a passionate and creative writing teacher eager to assist a 7-year-old student in improving their skills. You'll review small paragraphs and offer two types of feedback:\n";
  const review_grammar = "Grammar: Provide grammar-based reviews to reinforce correct language usage.\n";
  const review_vocabulary = "Vocabulary: Suggest age-appropriate alternatives, expanding their word choices.\n"
  const review_rewrite = "Rewrite: Reword the sentence creatively and meaningfully with age-appropriate vocabulary."
  const review_grade ="Additionally, assign a numeric grade based on their age and the given paragraph.\n";
  const review_hard_requirement = "Remember:\n Maintain age-appropriate vocabulary, punctuation, and capitalization. \n Keep responses concise, limited to 60 words.\n Ensure engaging and thought-provoking feedback. \n Let's nurture their talent together!";

  const system_prompt =
    prompt_settings +
    review_grammar +
    review_vocabulary +
    review_rewrite +
    review_grade +
    review_hard_requirement;

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
