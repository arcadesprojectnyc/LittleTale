import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

function WriteStory() {
  const { token, char_type, char_name, where_is_char } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const displayTextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (displayTextRef.current) {
      displayTextRef.current.scrollTop = displayTextRef.current.scrollHeight;
    }
  }, [displayText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  /*const handleUpdateDisplayClick = () => {
    setDisplayText(displayText + '\n\n' + inputText);
    setInputText("")
  };*/

  const prompt_settings = "You are a 7-year-old kid who is good at writing and telling stories. Play a collaborative writing game with a same-age kid.";
  const style_requirement = "1. Write a Harry Potter-style story in a creative and funny way.";
  const length_requirement = "2. Every time, you can write at most 2-3 sentences to continue the story."
  const purpose_requirement = "3. Your answer should use 7-year-old age vocabulary and, at the same time, try to improve the other kid's reading and writing to the next level. Start with your answer to the story directly, without greeting."
  const user_customized_beginnings = "Beginning of the story: a knight named Rox is riding a house to a castle";
  
  const begin_prompt = prompt_settings + style_requirement + length_requirement + purpose_requirement + user_customized_beginnings
  
  const continue_prompt = "\n Continue collaborating with the user to advance the story, adding creative and humorous details that enhance the story's enjoyment and encourage its continuation. The user's continue the story as: "

  const handleAPIRequest = async (prompt) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": prompt }],
          "temperature": 0.7
        }),
      });

      const data = await response.json();
      console.log("api returned data: ", token, prompt)
      setIsLoading(false);
      return data.choices[0].message.content;
    } catch (error) {
      setIsLoading(false);
      console.error('Error:', error);
      return '';
    }
  }

  const appendToDisplay = (res, msg) => {
    if (res != '') {
      res = res + '\n\n';
    }
    res = res + msg;
    setDisplayText(res);
    setInputText("");

    return res
  }

  const handleUpdateDisplayClick = async () => {
    let prompt = ''
    let res = displayText;
    if (inputText != '') {
      res = appendToDisplay(res, inputText)
      console.log("res: ", res)
      prompt = res + continue_prompt
    } else {
      prompt = begin_prompt;
    }
    const apiResponse = await handleAPIRequest(prompt);
    if (apiResponse !== '') {
      res = appendToDisplay(res, apiResponse)
    }
  };

  const handleClearDisplayClick = () => {
    setDisplayText("");
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Story To Be Continued</h3>
        <div
          ref={displayTextRef}
          style={{
            border: '1px solid #ccc',
            marginBottom: '20px',
            height: '40vh',
            width: '90vh',
            padding: '10px',
            overflow: 'auto',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {displayText}
        </div>
      </div>
      <div style={{
        marginBottom: '20px'
      }}>
        <h3>Continue The Story</h3>
        <textarea
          style={{
            border: '1px solid #ccc',
            height: '20vh',
            padding: '10px',
            width: '90vh',
          }}
          value={inputText}
          onChange={handleInputChange}
          disabled={isLoading}
        ></textarea>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleUpdateDisplayClick} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Display'}
        </button>
        <button onClick={handleClearDisplayClick} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Clear Display'}
        </button>
      </div>
    </div >
  );
}

export default WriteStory;
