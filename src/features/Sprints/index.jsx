import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sprint from '../../components/Sprints';
import Draggable from 'react-draggable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ModalOverlay, ModalContent } from './styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Sprints = () => {
  const navigate = useNavigate();
  const { projectName } = useParams();
  const [sprints, setSprints] = useState([]);
  const [newSprintName, setNewSprintName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSprintIndex, setCurrentSprintIndex] = useState(null);

  const toggleModal = () => setShowModal(!showModal);

  const saveSprintsToLocalStorage = (sprints) => {
    localStorage.setItem(`sprints_${projectName}`, JSON.stringify(sprints));
  };

  const loadSprintsFromLocalStorage = () => {
    const savedSprints = localStorage.getItem(`sprints_${projectName}`);
    return savedSprints ? JSON.parse(savedSprints) : [];
  };

  useEffect(() => {
    const storedSprints = loadSprintsFromLocalStorage();
    setSprints(storedSprints);
  }, [projectName]);

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (newSprintName.trim()) {
      const newSprint = {
        name: newSprintName,
        createdAt: new Date().toISOString(),
      };
      const updatedSprints = isEditing
        ? sprints.map((sprint, index) => (index === currentSprintIndex ? newSprint : sprint))
        : [...sprints, newSprint];

      setSprints(updatedSprints);
      saveSprintsToLocalStorage(updatedSprints);
      setNewSprintName('');
      setShowModal(false);
      setIsEditing(false);
    }
  };

  const handleEditSprint = (index) => {
    setNewSprintName(sprints[index].name);
    setCurrentSprintIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDrag = (e, data, sprintName) => {
    if (data.x < -100) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir a sprint "${sprintName}"?`);
      if (confirmed) {
        const updatedSprints = sprints.filter(sprint => sprint.name !== sprintName);
        setSprints(updatedSprints);
        saveSprintsToLocalStorage(updatedSprints);
      }
    }
  };

  return (
    <div className='Sprints'>
      <Header projectName={projectName} />

      <div
        className="sprint-list"
        style={sprints.length === 0
          ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center', color: 'white' }
          : {}}
      >
        {sprints.length > 0 ? (
          sprints.map((sprint, index) => (
            <Draggable
              key={index}
              onStop={(e, data) => handleDrag(e, data, sprint.name)}
              axis="x"
              bounds={{ left: -200, top: 0, right: 0, bottom: 0 }}
            >
              <div>
                <Sprint
                  name={sprint.name}
                  createdAt={sprint.createdAt}
                  onEdit={() => handleEditSprint(index)} // Passa a função de edição
                />
              </div>
            </Draggable>
          ))
        ) : (
          <p>Nenhuma sprint criada ainda.</p>
        )}
      </div>

      <Fab
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000
        }}
        size="large"
        color="primary"
        aria-label="back"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Fab>

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
          setNewSprintName('');
          setIsEditing(false);
          toggleModal();
        }}
      >
        <AddIcon />
      </Fab>

      {showModal && (
        <ModalOverlay onClick={toggleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? 'Editar Sprint' : 'Nova Sprint'}</h2>
            <form onSubmit={handleCreateSprint}>
              <label>Nome da Sprint</label>
              <input
                type="text"
                value={newSprintName}
                onChange={(e) => setNewSprintName(e.target.value)}
                placeholder="Digite o nome da sprint"
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

export default Sprints;
