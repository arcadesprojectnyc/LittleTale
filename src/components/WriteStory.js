import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

function WriteStory() {
  const { token, char_type, char_name, where_is_char } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const messageContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleMessageRole = (role) => {
    if (role === 'user') {
      return 'user-message';
    } else if (role === 'assistant') {
      return 'assistant-message';
    } else if (role === 'system') {
      return 'system-message';
    } else {
      return '';
    }
  };

  const prompt_settings = "Act as a creative writing teacher who wants to help a 7-year-old student improve their reading and writing skills.";
  const length_requirement = "Everytime write 2 sentences that continue the story in a creative and funny way based on the user's input. Don't repeat user's input.\n";
  const style_requirement = "Let's play a collaborative writing game where we write an adventurous story together! You can use symbolism, metaphor, or imagery to make the story more interesting. \n"
  const purpose_requirement = "Remember to use age-appropriate vocabulary and correct punctuation and capitalization. Make sure the storyline is consistent and follow the kid's input. \n Avoid making big progress in the story and focus on giving more details. \n Let's see where our imaginations take us!"
  const consistent_requirement = "Continue the story user wrote."
  const beginnings = "A knight named Rex is riding a horse to a castle.";

  const system_prompt = prompt_settings + style_requirement + length_requirement + purpose_requirement + consistent_requirement;

  const handleAPIRequest = async (msgs) => {
    try {
      setIsLoading(true);
      console.log("[handleAPIRequest] req", token, msgs);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": msgs,
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

  const handleUpdateDisplayClick = async () => {
    let prompt = ''
    let msgs = messages;
    if (msgs.length != 0 && inputText != '') {
      const userRoleMessage = {
        role: 'user',
        content: inputText,
      }
      msgs = [...msgs, userRoleMessage];
    } else if (msgs.length == 0) {
      const systemRoleMessage = {
        role: 'system',
        content: system_prompt,
      };
      const userBeginMessage = {
        role: 'user',
        content: beginnings,
      }
      msgs = [systemRoleMessage, userBeginMessage]
    }
    setInputText("")
    const apiResponse = await handleAPIRequest(msgs);
    if (apiResponse !== '') {
      msgs = [...msgs, apiResponse];
    }
    setMessages(msgs)
  };

  const handleClearDisplayClick = () => {
    setMessages([])
  };

  const filteredMessages = messages.filter(message => message.role !== 'system');

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Story To Be Continued</h3>
        <div
          ref={messageContainerRef}
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
          {filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${handleMessageRole(message.role)}`}
            >
              {message.content}
            </div>
          ))}
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
