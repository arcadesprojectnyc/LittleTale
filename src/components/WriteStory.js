import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';


function WriteStory() {
  const { token, char_type, char_name, where_is_char } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const displayTextRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]); // Keep updating messages
  

  /* Create Basic Prompt 
  system prompt - Ask the model to adopt a persona 
  user prompt - Initial customer user based on the previous page 
  See example - https://platform.openai.com/docs/guides/gpt/chat-completions-api
  */ 
  const prompt_settings = "You are a 7-year-old kid who is good at writing and telling stories. Play a collaborative writing game with a same-age kid.";
  const style_requirement = "1. Write a Harry Potter-style story in a creative and funny way. Please also consider incorporating elements such as symbolism, metaphor , or imagery to enhance the story's impact on the reader.";
  const length_requirement = "2. Every time, you can write at most 250 words to continue the story.";
  const purpose_requirement = "3. Your answer should use 7-year-old age vocabulary. It should be written in a style appropriate for the other kid and try to improve the other kid's reading and writing to the next level.";

  const system_prompt = prompt_settings + style_requirement + length_requirement + purpose_requirement;
  const user_customized_beginnings = "Beginning of the story: a knight named Rox is riding a house to a castle"
  
  // TODO: how to convert this as the default message to begin with?
  // "messages": [
    
  //   { "role": "system", "content": system_prompt}, // Give the model a persona 
  //   { "role": "user", "content": user_customized_beginnings}, // 
  // ],

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

  const handleAPIRequest = async (new_message) => {
    // TODO: How to append the new message to the old messages?
    // setMessages([...messages, new_message]); // Update messages

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
          "messages": ,// TODO: Put updated messages here,
          "temperature": 0.7
        }),
      });

      const data = await response.json();
      console.log("api returned data: ", token, new_message)
      setIsLoading(false);
     
      return data.choices[0].message; // return both content and role
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
    res = res + msg.content;
    setDisplayText(res);
    setInputText("");

    return res
  }

  const handleUpdateDisplayClick = async () => {
    let new_message = ''
    let res = displayText; // Old text
    // If user input new messages, we need to append it to the original prompt 
    // then set up the message rowl as "user"
    if (inputText != '') {
      content = appendToDisplay(res, inputText) // Append user's input to display
      console.log("res: ", content) // Log to the system
      new_message = {"role": "user", "content": inputText} // Append user's input to the prompt, TODO: how to separate user's input vs. assistance's
    } 
    const apiResponse = await handleAPIRequest(new_message); // Update new messages
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
