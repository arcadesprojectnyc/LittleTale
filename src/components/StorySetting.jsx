import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

function StorySetting() {
  const [title, setTitle] = useState("");
  const [beginning, setBeginning] = useState("");
  const navigate = useNavigate();
  const { setTitleCxt, setBeginningCxt, setWriteStoryMsgCxt } =
    useContext(UserContext);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBeginningChange = (event) => {
    setBeginning(event.target.value);
  };
  const handleButtonClick = () => {
    if (title == "" || beginning == "") {
      console.log("[Select.log] Title: " + title + ", beginning: " + beginning);
      alert(`Let's write the story title and the beginning!`);
    } else {
      setTitleCxt(title);
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
        <h2 className="h2-style">
          What's the opening line of your little tale?
        </h2>
        <p className="interface-text">Story Title</p>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="input-field"
        />
        <p className="interface-text">Beginning of the Story</p>
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
