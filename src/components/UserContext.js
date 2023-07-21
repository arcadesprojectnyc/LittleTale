import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [token, setToken] = useState(null);
  const [char_name, setCharName] = useState(null);
  const [beginning, setBeginning] = useState(null);
  const [write_story_msgs, setWriteStoryMsgs] = useState(null);

  const setTokenValue = (token) => {
    setToken(token);
  };

  const setCharNameValue = (char_name) => {
    setCharName(char_name);
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
    char_name,
    setCharNameCxt: setCharNameValue,
    beginning,
    setBeginningCxt: setBeginningValue,
    write_story_msgs,
    setWriteStoryMsgCxt: setWriteStoryMsgsValue,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
