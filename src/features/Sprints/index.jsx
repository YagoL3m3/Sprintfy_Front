import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Sprint from '../../components/Sprints'; // Certifique-se de que este componente existe
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ModalOverlay, ModalContent } from './styles';

const Sprints = () => {
  const { projectName } = useParams();
  const [sprints, setSprints] = useState([]); // Inicie com um array vazio para sprints
  const [newSprintName, setNewSprintName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (newSprintName.trim()) {
      setSprints([...sprints, newSprintName]);
      setNewSprintName('');
      setShowModal(false);
    }
  };

  return (
    <div className='Sprints'>
      <Header projectName={projectName} />
      
      <div className="sprint-list">
        {sprints.length > 0 ? (
          sprints.map((sprint, index) => (
            <div key={index}>
              <Sprint name={sprint} />
            </div>
          ))
        ) : (
          <p>Nenhuma sprint criada ainda.</p>
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
            <h2>Nova Sprint</h2>
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

export default Sprints;
