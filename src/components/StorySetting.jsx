import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function StorySetting() {
  const [charactor_name, setCharactorName] = useState("");
  const [beginning, setBeginning] = useState("");
  const navigate = useNavigate();
  const { setCharNameCxt, setBeginningCxt, setWriteStoryMsgCxt } =
    useContext(UserContext);

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

  useEffect(() => {
    setWriteStoryMsgCxt([]);
  }, []);

  return (
    <div className="setting-background-container">
      <div className="centered-content">
        <h2 className="h2-style">What's in your mind?</h2>
        <p className="interface-text">Name your character:</p>
        <input
          type="text"
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
        <p></p>
          <button onClick={handleButtonClick} className="button">
            I'm ready!
          </button>
        </div>
      </div>
    </div>
  );
}

export default StorySetting;
