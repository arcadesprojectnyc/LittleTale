import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [token, setToken] = useState(null);
  const [char_type, setCharType] = useState(null);
  const [char_name, setCharName] = useState(null);
  const [where_is_char, setWhereIsChar] = useState(null);
  const [write_story_msgs, setWriteStoryMsgs] = useState(null);

  const setTokenValue = (token) => {
    setToken(token);
  };

  const setCharTypeValue = (char_type) => {
    setCharType(char_type);
  };

  const setCharNameValue = (char_name) => {
    setCharName(char_name);
  };

  const setWhereIsCharValue = (where_is_char) => {
    setWhereIsChar(where_is_char);
  };

  const setWriteStoryMsgsValue = (write_story_msgs) => {
    setWriteStoryMsgs(write_story_msgs);
  };

  // Value object to be provided to consuming components
  const value = {
    token,
    setTokenCxt: setTokenValue,
    char_type,
    setCharTypeCxt: setCharTypeValue,
    char_name,
    setCharNameCxt: setCharNameValue,
    where_is_char,
    setWhereIsCharCxt: setWhereIsCharValue,
    write_story_msgs,
    setWriteStoryMsgCxt: setWriteStoryMsgsValue,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
