import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import Header from '../../components/Header';
import Project from '../../components/Project';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ModalOverlay, ModalContent } from './styles';
import './Projetos.css';

const Projetos = () => {
  const [projects, setProjects] = useState([
    { name: 'Projeto 1', sprints: ['Sprint 1', 'Sprint 2'], createdAt: new Date() },
    { name: 'Projeto 2', sprints: ['Sprint A', 'Sprint B'], createdAt: new Date() }
  ]);

  const [newProjectName, setNewProjectName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const addProject = (projectName) => {
    const newProject = {
      name: projectName,
      sprints: [],
      createdAt: new Date() // Armazena a data atual
    };
    setProjects([...projects, newProject]);
  };

  const handleDrag = (e, data, projectName) => {
    if (data.x < -100) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${projectName}"?`);
      if (confirmed) {
        setProjects(projects.filter(project => project.name !== projectName));
      }
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName);
      setNewProjectName('');
      setShowModal(false);
    }
  };

  const handleProjectClick = (projectName) => {
    navigate(`/projeto/${projectName}`);
  };

  // Função para formatar a data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className='Home'>
      <Header addProject={addProject} />

      <div className="project-list" style={projects.length === 0
        ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center', color: 'white' }
        : {}}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <Draggable
              key={index}
              onStop={(e, data) => handleDrag(e, data, project.name)}
              axis="x"
              bounds={{ left: -200, top: 0, right: 0, bottom: 0 }} // Limita o movimento horizontal
            >
              <div onClick={() => handleProjectClick(project.name)}>
                <Project project={project} sprints={project.sprints} />
              </div>
            </Draggable>
          ))
        ) : (
          <p>Nenhum projeto criado ainda.</p>
        )}
      </div>

      <Fab
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}
        size="large"
        color="primary"
        aria-label="add"
        onClick={toggleModal}
      >
        <AddIcon />
      </Fab>

      {showModal && (
        <ModalOverlay onClick={toggleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>Novo Projeto</h2>
            <form onSubmit={handleCreateProject}>
              <label>Nome do Projeto</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Digite o nome do projeto"
                required
              />
              <div>
                <button type="submit">Criar</button>
                <button type="button" onClick={toggleModal}>Cancelar</button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Projetos;
