import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './features/Login';
import Projetos from './features/Projetos';
import Menu from './features/Menu';
import Sprints from './features/Sprints';
import Daily from './features/Dailys';
 // Importe o novo componente

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/Menu' element={<Menu/>}/>
        <Route path='/Projetos' element={<Projetos/>}/>
        {/* Adicione a rota dinâmica para o projeto */}
        <Route path='/projeto/:projectName' element={<Sprints/>} /> 
        <Route path="/sprint/:sprintName" element={<Daily/>} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
