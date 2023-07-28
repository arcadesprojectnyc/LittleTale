import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [token, setToken] = useState(null);
  const [title, setTitle] = useState(null);
  const [beginning, setBeginning] = useState(null);
  const [write_story_msgs, setWriteStoryMsgs] = useState(null);

  const setTokenValue = (token) => {
    setToken(token);
  };

  const setTitleValue = (title) => {
    setTitle(title);
  };

  const setBeginningValue = (beginning) => {
    setBeginning(beginning);
  };

  const setWriteStoryMsgsValue = (write_story_msgs) => {
    setWriteStoryMsgs(write_story_msgs);
  };

  // Value object to be provided to consuming components
  const value = {
    token,
    setTokenCxt: setTokenValue,
    title,
    setTitleCxt: setTitleValue,
    beginning,
    setBeginningCxt: setBeginningValue,
    write_story_msgs,
    setWriteStoryMsgCxt: setWriteStoryMsgsValue,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
