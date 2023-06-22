import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TokenInput from './components/TokenInput';
import StorySetting from './components/StorySetting';
import WriteStory from './components/WriteStory';
import { UserProvider } from './components/UserContext';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <UserProvider>
            <Routes>
              <Route path="/" element={<TokenInput />} />
              <Route path="story-setting" element={<StorySetting />} />
              <Route path="write-story" element={<WriteStory />} />
            </Routes>
          </UserProvider>
        </header>
      </div>
    </Router>
  );
}
/*
                <Route path=":token" element={<SelectPage />} />
              </Route>

*/
export default App;
