import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../images/logo_new.png";
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
    <div className="background-container"> {/* Updated div element */}
      <div>
        <p style={{ fontSize: "20px" }}>
          Input OpenAI's Token below and start writing:
        </p>
        <input type="text" value={token} onChange={handleTokenChange} />
        <div>
          <button onClick={handleButtonClick}>Start Writing</button>
        </div>
      </div>
    </div>
  );
}

export default TokenInput;
