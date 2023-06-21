import logo from '../../images/logo.png';
import '../../App.css';
import InputAndButton from './InputAndButton';
import React from 'react';

// InputAndButton will redict to Select Page
function MainPage() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <InputAndButton></InputAndButton>
      </header>
    </div>
  );
}

export default MainPage;