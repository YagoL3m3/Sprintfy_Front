import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import Header from '../../components/Header';
import Project from '../../components/Project';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ModalOverlay, ModalContent } from './styles';
import './Projetos.css';

const Projetos = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null);

  const navigate = useNavigate();

  const saveProjectsToLocalStorage = (projects) => {
    localStorage.setItem('projects', JSON.stringify(projects));
  };

  const loadProjectsFromLocalStorage = () => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  };

  useEffect(() => {
    const storedProjects = loadProjectsFromLocalStorage();
    setProjects(storedProjects);
  }, []);

  const addProject = (projectName) => {
    const newProject = { name: projectName, sprints: [], createdAt: new Date() };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects);
  };

  const updateProject = (projectName) => {
    const updatedProjects = [...projects];
    updatedProjects[currentProjectIndex].name = projectName;
    setProjects(updatedProjects);
    saveProjectsToLocalStorage(updatedProjects);
  };

  const handleDrag = (e, data, projectName) => {
    if (data.x < -100) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${projectName}"?`);
      if (confirmed) {
        const updatedProjects = projects.filter(project => project.name !== projectName);
        setProjects(updatedProjects);
        saveProjectsToLocalStorage(updatedProjects);
      }
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      isEditing ? updateProject(newProjectName) : addProject(newProjectName);
      setNewProjectName('');
      setIsEditing(false);
      setShowModal(false);
    }
  };

  const handleEditProject = (index) => {
    setNewProjectName(projects[index].name);
    setCurrentProjectIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleProjectClick = (projectName) => {
    navigate(`/projeto/${projectName}`);
  };

  return (
    <div className='Home'>
      <Header addProject={addProject} />

      <div className="project-list" style={projects.length === 0 ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center', color: 'white' } : {}}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <Draggable
              key={index}
              onStop={(e, data) => handleDrag(e, data, project.name)}
              axis="x"
              bounds={{ left: -200, top: 0, right: 0, bottom: 0 }}
            >
              <div>
                <Project
                  project={project}
                  onClick={() => handleProjectClick(project.name)}
                  onEdit={() => handleEditProject(index)}
                />
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
        onClick={() => {
          setNewProjectName('');
          setIsEditing(false);
          toggleModal();
        }}
      >
        <AddIcon />
      </Fab>

      {showModal && (
        <ModalOverlay onClick={toggleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? 'Editar Projeto' : 'Novo Projeto'}</h2>
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
                <button type="submit">{isEditing ? 'Atualizar' : 'Criar'}</button>
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
