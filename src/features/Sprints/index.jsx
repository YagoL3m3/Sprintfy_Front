import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sprint from '../../components/Sprints';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ModalOverlay, ModalContent } from './styles';
import './Sprints.css';
import { firestore } from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, updateDoc, onSnapshot, doc, getDoc, query, getDocs } from 'firebase/firestore';
import { useAuth } from '../../authContext';

const Sprints = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [sprints, setSprints] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [newSprintName, setNewSprintName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSprintIndex, setCurrentSprintIndex] = useState(null);
  const { user } = useAuth();
  const [userRole, setUserRole] = useState('');
  const [projectOwner, setProjectOwner] = useState(null);
  const currentUserId = user?.uid;

  // Carregar dados do projeto
  useEffect(() => {
    const fetchProjectData = async () => {
      const docRef = doc(firestore, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const projectData = docSnap.data();
        setProjectName(projectData.name);
        setProjectOwner(projectData.createdBy); // Armazenando o ID do dono do projeto
      } else {
        console.log("Projeto não encontrado!");
      }
    };
    fetchProjectData();
  }, [projectId]);

  // Carregar sprints
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, `projects/${projectId}/sprints`),
      (snapshot) => {
        const sprintsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSprints(sprintsData);
      }
    );
    return () => unsubscribe();
  }, [projectId]);

  // Carregar papel do usuário
  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role); // Role pode ser 'admin', 'manager' ou outro valor
        }
      };
      fetchUserRole();
    }
  }, [user]);

  const addSprint = async (sprintName) => {
    if (projectOwner === currentUserId || userRole === 'admin') {
      const newSprint = { name: sprintName, createdAt: new Date(), createdBy: currentUserId };
      try {
        await addDoc(collection(firestore, `projects/${projectId}/sprints`), newSprint);
        setShowModal(false);
      } catch (error) {
        console.error("Erro ao criar sprint: ", error);
      }
    } else {
      console.error("Você não tem permissão para criar uma sprint neste projeto.");
    }
  };

  const updateSprint = async (sprintId, updatedName) => {
    const sprint = sprints.find((s) => s.id === sprintId);
    if (sprint && (sprint.createdBy === currentUserId || userRole === 'admin')) {
      try {
        const sprintRef = doc(firestore, `projects/${projectId}/sprints`, sprintId);
        await updateDoc(sprintRef, { name: updatedName });
      } catch (error) {
        console.error('Erro ao atualizar sprint: ', error);
      }
    } else {
      console.error("Você não tem permissão para editar esta sprint.");
    }
  };

  const deleteSprint = async (sprintId) => {
    const sprint = sprints.find((s) => s.id === sprintId);
    if (sprint && (sprint.createdBy === currentUserId || userRole === 'admin')) {
      try {
        const dailysQuery = query(collection(firestore, `projects/${projectId}/sprints/${sprintId}/dailys`));
        const dailysSnapshot = await getDocs(dailysQuery);
        dailysSnapshot.forEach(async (doc) => await deleteDoc(doc.ref));
        await deleteDoc(doc(firestore, `projects/${projectId}/sprints`, sprintId));
      } catch (error) {
        console.error('Erro ao deletar sprint e dailys relacionadas: ', error);
      }
    } else {
      console.error("Você não tem permissão para deletar esta sprint.");
    }
  };

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (newSprintName.trim()) {
      if (isEditing) {
        updateSprint(sprints[currentSprintIndex].id, newSprintName);
      } else {
        addSprint(newSprintName);
      }
      setNewSprintName('');
      setIsEditing(false);
      setShowModal(false);
    }
  };

  const handleEditSprint = (index) => {
    const sprint = sprints[index];
    if (sprint.createdBy === currentUserId || userRole === 'admin') {
      setNewSprintName(sprint.name);
      setCurrentSprintIndex(index);
      setIsEditing(true);
      setShowModal(true);
    } else {
      console.error("Você não tem permissão para editar esta sprint.");
    }
  };

  const handleSprintClick = (sprintId) => navigate(`/projeto/${projectId}/sprints/${sprintId}/dailys`);

  return (
    <div className='Sprints'>
      <Header projectId={projectId} projectName={projectName} />
      <Fab
        style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}
        size="large"
        color="primary"
        aria-label="back"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Fab>

      <div className="sprint-list">
        {sprints.length > 0 ? (
          sprints.map((sprint, index) => (
            <div key={sprint.id}>
              <Sprint
                id={sprint.id}
                name={sprint.name}
                createdAt={sprint.createdAt}
                onEdit={() => handleEditSprint(index)}
                onDelete={() => deleteSprint(sprint.id)}
                onClick={() => handleSprintClick(sprint.id)}
                userRole={userRole}
                isProjectOwner={projectOwner === currentUserId} // Verifica se o usuário é o dono do projeto
              />
            </div>
          ))
        ) : (
          <p className='no-sprints-message'>Nenhuma sprint criada ainda.</p>
        )}
      </div>

      {(projectOwner === currentUserId || userRole === 'admin') && (
        <Fab
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, color: 'white' }}
          color="primary"
          size="large"
          aria-label="add"
          onClick={toggleModal}
        >
          <AddIcon />
        </Fab>
      )}

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
                required
              />
              <button type="submit">Salvar</button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Sprints;
