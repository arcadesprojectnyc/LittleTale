import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage/MainPage';
import SelectPage from './Pages/SelectPage/SelectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="select-page">
          <Route path=":token" element={<SelectPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
