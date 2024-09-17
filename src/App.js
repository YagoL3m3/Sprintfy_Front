import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './features/Login';
import Projetos from './features/Projetos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path='/Projetos' element={<Projetos/>}/>
        
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Router>

  );
}

export default App;
