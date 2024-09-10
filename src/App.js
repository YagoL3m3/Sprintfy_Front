import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './features/Login';
import Home from './features/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>

  );
}

export default App;
