import React, { useRef, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { handleAPIRequest, handleMessageRole } from "../utils/GPTUtils";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import MessagesContainer from "./MessagesContainer";
import CommentsContainer from "./CommentsContainer";

// the write_story_msgs to be the whole story line and sotry display.
// the messages in this reviewStory is only for gpt review conversation.
function ReviewStory() {
  const { token, write_story_msgs, setWriteStoryMsgCxt } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [jumpToMessageIndex, setJumpToMessageIndex] = useState(null);
  const [editMessageIndex, setEditMessageIndex] = useState(null);
  const [commentMessageHeight, setCommentMessageHeight] = useState(null);
  const [messages, setMessages] = useState([]);
  const [commentMessages, setCommentMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const resetSystem = () => {
      const systemRoleMessage = {
        role: "system",
        content: system_prompt,
      };
      setMessages([systemRoleMessage]);
    };
    resetSystem();
  }, []);

  const prompt_settings =
    "You are a passionate and creative writing teacher eager to assist a 7-year-old student in improving their skills. You'll review small paragraphs and offer two types of feedback:\n";
  const review_grammar =
    "Grammar: Provide grammar-based reviews to reinforce correct language usage.\n";
  const review_vocabulary =
    "Vocabulary: Suggest age-appropriate alternatives, expanding their word choices.\n";
  const review_rewrite =
    "Rewrite: Reword the sentence creatively and meaningfully with age-appropriate vocabulary.";
  const review_grade =
    "Additionally, assign a numeric grade based on their age and the given paragraph.\n";
  const review_hard_requirement =
    "Remember:\n Maintain age-appropriate vocabulary, punctuation, and capitalization. \n Keep responses concise, limited to 60 words.\n Ensure engaging and thought-provoking feedback. \n Let's nurture their talent together!";

  const system_prompt =
    prompt_settings +
    review_grammar +
    review_vocabulary +
    review_rewrite +
    review_hard_requirement;

  const handleStartWriting = () => {
    navigate("/story-setting/");
  };

  const handleMsgRecommendation = async (index) => {
    console.log("ReviewStory: handle review msg: ", index);
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
    if (apiResponse !== "" && apiResponse.content !== null) {
      msgs = [...msgs, apiResponse];
      // The index passed in with no system msg, so plus 1 back
      setCommentMessages(apiResponse.content.split("\n"));
    }
    setMessages(msgs);
  };

  const setEditedMessage = (msg) => {
    console.log(
      "setEditedMessage: ",
      msg,
      " editMessageIndex: ",
      editMessageIndex
    );
    let temp_write_story_msgs = write_story_msgs;
    temp_write_story_msgs[editMessageIndex + 1] = {
      role: "user",
      content: msg,
    };
    setWriteStoryMsgCxt(temp_write_story_msgs);
    setEditMessageIndex(null);
  };

  const handleEditMsg = (index) => {
    console.log("ReviewStory: handle edit msg: ", index);
    setEditMessageIndex(index);
  };

  const saveToFile = () => {
    const formattedMessages = JSON.stringify(messages, null, 2);
    const blob = new Blob([formattedMessages], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, "messages.json");
  };

  const buttons = [
    {
      label: "Review",
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
      <h3 style={{ fontFamily: "spilt-ink" }}>To Be Reviewed</h3>
      <div
        style={{
          display: "flex",
          width: "90vw",
        }}
      >
        <MessagesContainer
          messages={write_story_msgs}
          height="70vh"
          width="70vw"
          autoScroll={false}
          buttons={buttons}
          isLoading={isLoading}
          jumpToMessageIndex={jumpToMessageIndex}
          setJumpToMessageIndex={setJumpToMessageIndex}
          setCommentMessageHeight={setCommentMessageHeight}
          editMessageIndex={editMessageIndex}
          setEditMessageIndex={setEditMessageIndex}
          setEditedMessage={setEditedMessage}
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
