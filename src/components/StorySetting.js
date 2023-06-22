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
            alert(`Let's write the charactor_type, name and background first!`);
        } else {
            setCharTypeCxt(charactor_type);
            setCharNameCxt(charactor_name);
            setWhereIsCharCxt(where_is_charactor);
            let path = "/write-story/";
            navigate(path);
        }
    }

    return (
        <div>
            <p style={{ fontSize: '20px' }}>What's the type of the character?</p>
            <input type="text" value={charactor_type} onChange={handleCharactorTypeChange} />
            <p style={{ fontSize: '20px' }}>What's the name?</p>
            <input type="text" value={charactor_name} onChange={handleCharactorNameChange} />
            <p style={{ fontSize: '20px' }}>Where is the character?</p>
            <input type="text" value={where_is_charactor} onChange={handleWhereIsCharactorChange} />
            <div>
                <button onClick={handleButtonClick}>Start Writing!!!</button>
            </div>
            <h3>You navigated to story setting with the following token:</h3>
            <p>{token}</p>
        </div>
    );
}

export default StorySetting;