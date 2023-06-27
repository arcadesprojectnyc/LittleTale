import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

function WriteStory() {
  const { token, char_type, char_name, where_is_char } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const displayTextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (displayTextRef.current) {
      displayTextRef.current.scrollTop = displayTextRef.current.scrollHeight;
    }
  }, [displayText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  /*
  It should be written in a style appropriate for your intended audience (e.g., children, young adults, or general adult readers). Please also consider incorporating elements such as symbolism, metaphor , or imagery to enhance the story's impact on the reader.
  */

  const prompt_settings = "You are a 7-year-old kid who is good at writing and telling stories. Play a collaborative writing game with a same-age kid.";
  const style_requirement = "1. Write a Harry Potter-style story in a creative and funny way. Please also consider incorporating elements such as symbolism, metaphor , or imagery to enhance the story's impact on the reader.";
  const length_requirement = "2. Every time, you can write at most 2-3 sentences to continue the story."
  const purpose_requirement = "3. Your answer should use 7-year-old age vocabulary. It should be written in a style appropriate for the other kid and try to improve the other kid's reading and writing to the next level."
  const beginnings = "A knight named Rex is riding a house to a castle";

  const system_prompt = prompt_settings + style_requirement + length_requirement + purpose_requirement
  
  const handleAPIRequest = async () => {
    try {
      setIsLoading(true);
      console.log("[handleAPIRequest] req", token, messages);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": messages,
          "temperature": 0.7,
          "top_p": 1,
          "frequency_penalty": 0.05,
        }),
      });

      const data = await response.json();
      if (data !== null) {
        console.log("[handleAPIRequest] resp", data.choices[0]);
      } else {
        console.log("GPT didn't response back!");
      }
      setIsLoading(false);
      return data.choices[0].message;
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
    let msgs = messages;
    if (displayText != '' && inputText != '') {
      res = appendToDisplay(res, inputText)
      console.log("res: ", res)
      const userRoleMessage = {
          role: 'user',
          content: inputText,
      }
      setMessages((prevMessages) => [...prevMessages, userRoleMessage]);
    } else if (displayText == '') {
      const systemRoleMessage = {
        role: 'system',
        content: system_prompt,
      };
      const userBeginMessage = {
        role: 'user',
        content: beginnings,
      }
      setMessages([systemRoleMessage, userBeginMessage]);      
    }
    const apiResponse = await handleAPIRequest();
    if (apiResponse !== '') {
      setMessages((prevMessages) => [...prevMessages, apiResponse]);  
      res = appendToDisplay(res, apiResponse.content)
    }
  };

  const handleClearDisplayClick = () => {
    setDisplayText("");
    setMessages([])
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
