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
    <div className="background-container"> {/* Updated div element */}
      <div className="centered-content">
        <p style={{ fontSize: "40px" }}>
          Input OpenAI's Token below and start writing:
        </p>
        <input type="text" value={token} 
        onChange={handleTokenChange} 
        style={{
            fontSize: "20px", // Adjust font size
            width: "80%", // Adjust width to make the input wider
            padding: "10px", // Adjust padding to increase input height
          }}/>
        <div>
          <button onClick={handleButtonClick}
          style={{
            fontSize: "30px", // Adjust font size
            padding: "10px 10px", // Adjust padding to increase button size
          }}
          >
            Start Writing
            </button>
        </div>
      </div>
    </div>
  );
}

export default TokenInput;
