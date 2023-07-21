import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function StorySetting() {
  const [charactor_name, setCharactorName] = useState("");
  const [beginning, setBeginning] = useState("");
  const navigate = useNavigate();
  const { setCharNameCxt, setBeginningCxt } = useContext(UserContext);

  const handleCharactorNameChange = (event) => {
    setCharactorName(event.target.value);
  };

  const handleBeginningChange = (event) => {
    setBeginning(event.target.value);
  };
  const handleButtonClick = () => {
    if (charactor_name == "" || beginning == "") {
      console.log(
        "[Select.log] char_name: " +
          charactor_name +
          ", beginning: " +
          beginning
      );
      alert(`Let's write the charactor name and the beginning!`);
    } else {
      setCharNameCxt(charactor_name);
      setBeginningCxt(beginning);
      let path = "/write-story/";
      navigate(path);
    }
  };
  
    return (
        <div className="setting-background-container">
            <div className="centered-content">
            <p className="interface-header">What's in your mind?</p>
            <p className="interface-text">Name your character:</p>
            <input type="text" 
            value={charactor_name} 
            onChange={handleCharactorNameChange}
            className="input-field"
             />
            <p className="interface-text">Write the beginning of the Story:</p>
            <textarea
                className="input-textarea"
                value={beginning}
                onChange={handleBeginningChange}
                placeholder="Write the beginning of the Story..."
              ></textarea>
            <div>
             < button onClick={handleButtonClick} className="button">
             I'm ready!
          </button>
        </div>
        </div>
        </div>
    );
}

export default StorySetting;