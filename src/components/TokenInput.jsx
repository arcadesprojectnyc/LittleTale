import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";
import { UserContext } from "./UserContext";

// InputAndButton will redict to Select Page
function TokenInput() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { setTokenCxt } = useContext(UserContext);

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleButtonClick = () => {
    // Perform some action with the input value
    console.log(token);
    if (token == "") {
      alert(`Input the token to start writing`);
    } else {
      setTokenCxt(token);
      navigate("/story-setting/");
    }
  };

  return (
    <div className="token-background-container">
      <div className="centered-content">
        <h1 className="h1-style">Little Tales</h1>
        <p className="interface-text">
        Unlock your imagination with OpenAI's magical token!</p>
        <input
          type="text"
          value={token}
          onChange={handleTokenChange}
          className="input-field"
        />
        <div>
        <p></p>
        < button onClick={handleButtonClick} className="button">
          Let the adventure begin!
          </button>
        </div>
      </div>
    </div>
  );
}
  

export default TokenInput;
