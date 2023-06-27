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


  const prompt_settings = "Act as a creative writing teacher who wants to help a 7-year-old student improve their reading and writing skills.";
  const length_requirement= "Everytime write 2-3 sentences that continue the story in a creative and funny way based on the user's input. Don't repeat user's input.\n";
  const style_requirement = "Let's play a collaborative writing game where we write an adventurous story together! You can use symbolism, metaphor, or imagery to make the story more interesting. \n"
  const purpose_requirement = "Remember to use age-appropriate vocabulary and correct punctuation and capitalization. Make sure the storyline is consistent and follow the kid's input. \n Avoid making big progress in the story and focus on giving more details. \n Let's see where our imaginations take us!"
  const beginnings = "Beginning of the story: A knight named Rex is riding a horse to a castle.";

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
          "frequency_penalty": 0.1,
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
