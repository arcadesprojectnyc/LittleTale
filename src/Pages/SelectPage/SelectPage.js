import React from 'react';
import { useParams } from 'react-router-dom';

function SelectPage() {
    let { token } = useParams();
    console.log("[Select.log] token: " + token)

    return (
        <div className="App">
          <header className="App-header">
            <div>
                <h2>You navigated to this page with the following value:</h2>
                <p>{token}</p>
            </div>
            </header>
        </div>
    );
}

export default SelectPage;