import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext'; // Supondo que tenha um contexto de autenticação configurado
import Header from '../../components/Header';
import Project from '../../components/Project';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ModalOverlay, ModalContent } from './styles';
import './Projetos.css';
import { firestore } from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, updateDoc, onSnapshot, doc, query, where, getDocs } from 'firebase/firestore';

const Projetos = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { user, isAdmin } = useAuth(); // Contexto de autenticação que fornece user e isAdmin
  const userId = user?.uid;

  // Carregar projetos do Firestore em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    });

    return () => unsubscribe(); // Limpa o listener
  }, []);

  const addProject = async (projectName) => {
    const newProject = {
      name: projectName,
      createdAt: new Date(),
      createdBy: userId, // Registra o usuário criador
    };

    try {
      await addDoc(collection(firestore, 'projects'), newProject);
      setNewProjectName('');
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao criar projeto: ", error);
    }
  };

  const updateProject = async (projectId, updatedName) => {
    const project = projects.find((p) => p.id === projectId);

    // Verifica se o usuário atual é o criador do projeto ou um administrador
    if (project && (project.createdBy === userId || isAdmin)) {
      try {
        const projectRef = doc(firestore, 'projects', projectId);
        await updateDoc(projectRef, { name: updatedName });
        console.log('Projeto atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar projeto: ', error);
      }
    } else {
      console.error("Você não tem permissão para editar este projeto.");
    }
  };

  const deleteProject = async (projectId) => {
    const project = projects.find((p) => p.id === projectId);

    // Verifica se o usuário atual é o criador do projeto ou um administrador
    if (project && (project.createdBy === userId || isAdmin)) {
      try {
        // Deletar as sprints relacionadas ao projeto
        const sprintsQuery = query(collection(firestore, 'sprints'), where('projectId', '==', projectId));
        const sprintsSnapshot = await getDocs(sprintsQuery);
        sprintsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Deletar as dailys relacionadas ao projeto
        const dailysQuery = query(collection(firestore, 'dailys'), where('projectId', '==', projectId));
        const dailysSnapshot = await getDocs(dailysQuery);
        dailysSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // Finalmente, deletar o projeto em si
        await deleteDoc(doc(firestore, 'projects', projectId));
        console.log('Projeto e documentos relacionados deletados com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar projeto e documentos relacionados: ', error);
      }
    } else {
      console.error("Você não tem permissão para deletar este projeto.");
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      if (isEditing) {
        updateProject(projects[currentProjectIndex].id, newProjectName);
      } else {
        addProject(newProjectName);
      }
      setNewProjectName('');
      setIsEditing(false);
      setShowModal(false);
    }
  };

  const handleEditProject = (index) => {
    const project = projects[index];
    if (project.createdBy === userId || isAdmin) {
      setNewProjectName(projects[index].name);
      setCurrentProjectIndex(index);
      setIsEditing(true);
      setShowModal(true);
    } else {
      console.error("Você não tem permissão para editar este projeto.");
    }
  };

  const handleDeleteProject = (index) => {
    const project = projects[index];
    if (project.createdBy === userId || isAdmin) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`);
      if (confirmed) {
        deleteProject(project.id);
      }
    } else {
      console.error("Você não tem permissão para excluir este projeto.");
    }
  };

  const handleProjectClick = (projectId) => {
    if (!isDeleting) {
      navigate(`/projeto/${projectId}/sprints`); // Mude para usar projectId
    }
    setIsDeleting(false);
  };

  return (
    <div className='Home'>
      <Header addProject={addProject} />

      <div className="project-list" style={projects.length === 0 ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center', color: 'white' } : {}}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={project.id}>
              <Project
                project={project}
                onClick={() => handleProjectClick(project.id)} // Passa o ID do projeto
                onEdit={() => handleEditProject(index)}
                onDelete={() => handleDeleteProject(index)} // Passa a função de excluir
                showEditButton={project.createdBy === userId || isAdmin} // Exibe o botão de editar somente para criador ou admin
                showDeleteButton={project.createdBy === userId || isAdmin} // Exibe o botão de excluir somente para criador ou admin
              />
            </div>
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
