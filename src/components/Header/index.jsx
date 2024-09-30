import React, { useState } from 'react';
import { Container, ModalOverlay, ModalContent } from './styles';
import { FaBars } from 'react-icons/fa';
import { IoMdAdd } from "react-icons/io";
import Sidebar from '../Sidebar';

const Header = ({ addProject, projectName }) => { // Adicione projectName aqui
  const [sidebar, setSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const toggleSidebar = () => setSidebar(!sidebar);
  const toggleModal = () => setShowModal(!showModal);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName);
      setNewProjectName('');
      setShowModal(false);
    }
  };

  return (
    <Container>
      <FaBars onClick={toggleSidebar} />
      {sidebar && <Sidebar active={setSidebar} />}
      
      <h1>{projectName ? `${projectName}` : 'Bem-vindo(a)!'}</h1> {/* Mostra o nome do projeto se disponível */}

      {/* Modal */}
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
    </Container>
  );
};

export default Header;
