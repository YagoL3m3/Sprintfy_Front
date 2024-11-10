import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './features/Login';
import Projetos from './features/Projetos';
import Menu from './features/Menu';
import Sprints from './features/Sprints';
import Daily from './features/Dailys';
import CriarUsuario from './features/CriarUsuario'; 
import { AuthProvider } from './authContext'; // Importação do AuthProvider

function App() {
  return (
    <AuthProvider> {/* Envolvendo o Router com o AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Menu" element={<Menu />} />
          <Route path="/Projetos" element={<Projetos />} />
          <Route path="/projeto/:projectId/sprints" element={<Sprints />} />
          <Route path="/projeto/:projectId/sprints/:sprintId/dailys" element={<Daily />} />
          <Route path="/criar-usuario" element={<CriarUsuario />} /> 
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
