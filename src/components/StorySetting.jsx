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
    <div>
      <p style={{ fontSize: "20px" }}>Name your character:</p>
      <input
        type="text"
        value={charactor_name}
        onChange={handleCharactorNameChange}
      />
      <p style={{ fontSize: "20px" }}>Write the beginning of the Story:</p>
      <textarea
        style={{
          border: "1px solid #ccc",
          height: "20vh",
          padding: "10px",
          width: "60vh",
        }}
        value={beginning}
        onChange={handleBeginningChange}
      ></textarea>
      <div>
        <button onClick={handleButtonClick}>Start Writing!!!</button>
      </div>
    </div>
  );
}

export default StorySetting;
