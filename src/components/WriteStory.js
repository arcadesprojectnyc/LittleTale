import React, {useContext} from 'react';
import { UserContext } from './UserContext';

function WriteStory() {
    const { token, char_type, char_name, where_is_char } = useContext(UserContext);

    return (
        <div>
            <h3>You navigated to write story with the following data:</h3>
            <p>token: {token}</p>            
            <p>char_type: {char_type}</p>            
            <p>char_name: {char_name}</p>            
            <p>where_is_char: {where_is_char}</p>            
        </div>
    );
}

/*
                <p>Token: {token}</p>
                <p>Char Type: {char_type}</p>
                <p>Char Name: {char_name}</p>
                <p>Where is Char: {where_is_char}</p>
*/

export default WriteStory;