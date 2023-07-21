import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function StorySetting() {
    const [charactor_type, setCharactorType] = useState('');
    const [charactor_name, setCharactorName] = useState('');
    const [where_is_charactor, setWhereIsCharactor] = useState('');
    const navigate = useNavigate();
    const { token, setCharTypeCxt, setCharNameCxt, setWhereIsCharCxt } = useContext(UserContext);

    const handleCharactorTypeChange = (event) => {
        setCharactorType(event.target.value);
    }

    const handleCharactorNameChange = (event) => {
        setCharactorName(event.target.value);
    }

    const handleWhereIsCharactorChange = (event) => {
        setWhereIsCharactor(event.target.value);
    }

    const handleButtonClick = () => {
        if (charactor_type == "" ||
            charactor_name == "" ||
            where_is_charactor == "") {
            console.log("[Select.log] char_type: " + charactor_type +
                ", char_name: " + charactor_name +
                ", where: " + where_is_charactor)
            alert(`Let's write the charactor, name and background first!`);
        } else {
            setCharTypeCxt(charactor_type);
            setCharNameCxt(charactor_name);
            setWhereIsCharCxt(where_is_charactor);
            let path = "/write-story/";
            navigate(path);
        }
    }

    return (
        <div className="setting-background-container">
            <div className="centered-content">
            <p className="interface-header">What's in your mind?</p>
            <p className="interface-text"> What's the character?</p>
            <input type="text" 
            value={charactor_type} 
            onChange={handleCharactorTypeChange} 
            className="input-field"
            />
            <p className="interface-text">What's the character's name?</p>
            <input type="text" 
            value={charactor_name} 
            onChange={handleCharactorNameChange}
            className="input-field"
             />
            <p className="interface-text">Where is the character?</p>
            <input type="text" 
            value={where_is_charactor} 
            onChange={handleWhereIsCharactorChange}
            className="input-field"
             />
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