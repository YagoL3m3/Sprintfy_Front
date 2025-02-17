import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DailyComponent from '../../components/Daily';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ModalOverlay, ModalContent } from './styles';
import { firestore } from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, updateDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../authContext';
import { Timestamp } from 'firebase/firestore';
import "../Dailys/dailys.css";

const Daily = () => {
  const navigate = useNavigate();
  const { projectId, sprintId } = useParams();
  const [dailys, setDailys] = useState([]);
  const [newDaily, setNewDaily] = useState({ name: '', description: '', activities: 0, team: 0, communication: 0, delivery: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDailyId, setCurrentDailyId] = useState(null);
  const [error, setError] = useState(null);
  const [sprintName, setSprintName] = useState('');
  const { user } = useAuth();
  const [userRole, setUserRole] = useState('');
  const [projectOwner, setProjectOwner] = useState(null);
  const currentUserId = user?.uid;

  // Carregar nome da sprint
  useEffect(() => {
    const fetchSprintName = async () => {
      try {
        const sprintDoc = await getDoc(doc(firestore, `projects/${projectId}/sprints`, sprintId));
        if (sprintDoc.exists()) {
          setSprintName(sprintDoc.data().name);
        }
      } catch (error) {
        console.error("Erro ao buscar o nome da sprint:", error);
        setError("Erro ao carregar o nome da sprint.");
      }
    };
    fetchSprintName();
  }, [projectId, sprintId]);

  // Carregar detalhes do projeto
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
        if (projectDoc.exists()) {
          setProjectOwner(projectDoc.data().createdBy);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do projeto:", error);
        setError("Erro ao carregar detalhes do projeto.");
      }
    };
    fetchProjectData();
  }, [projectId]);

  // Carregar papel do usuário
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  // Carregar dailys
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, `projects/${projectId}/sprints/${sprintId}/dailys`),
      (snapshot) => {
        const dailysData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setDailys(dailysData);
      },
      (error) => {
        console.error("Erro ao carregar as dailys:", error);
        setError("Erro ao carregar as dailys.");
      }
    );
    return () => unsubscribe();
  }, [projectId, sprintId]);

  // Verificar permissões
  const hasPermission = projectOwner === currentUserId || userRole === 'admin';

  // Adicionar Daily
  const addDaily = async (dailyData) => {
    try {
      const newDailyData = { ...dailyData, createdAt: Timestamp.now() };
      await addDoc(collection(firestore, `projects/${projectId}/sprints/${sprintId}/dailys`), newDailyData);
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar daily:', error);
      setError('Erro ao adicionar a daily.');
    }
  };

  // Atualizar Daily
  const updateDaily = async (dailyId, updatedData) => {
    try {
      const dailyRef = doc(firestore, `projects/${projectId}/sprints/${sprintId}/dailys`, dailyId);
      await updateDoc(dailyRef, updatedData);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar daily:", error);
      setError('Erro ao atualizar a daily.');
    }
  };

  // Deletar Daily
  const deleteDaily = async (dailyId) => {
    try {
      await deleteDoc(doc(firestore, `projects/${projectId}/sprints/${sprintId}/dailys`, dailyId));
    } catch (error) {
      console.error("Erro ao deletar daily:", error);
      setError('Erro ao deletar a daily.');
    }
  };

  // Alternar Modal
  const toggleModal = () => {
    if (!isEditing) {
      setNewDaily({ name: '', description: '', activities: 0, team: 0, communication: 0, delivery: 0 });
    }
    setShowModal(!showModal);
  };

  // Criar ou editar Daily
  const handleCreateDaily = (e) => {
    e.preventDefault();
    if (newDaily.name.trim()) {
      if (isEditing) {
        updateDaily(currentDailyId, newDaily);
      } else {
        addDaily(newDaily);  // Adiciona a nova daily
      }
      setNewDaily({ name: '', description: '', activities: 0, team: 0, communication: 0, delivery: 0 });  // Limpa os campos após a ação
      setIsEditing(false);  // Redefine para evitar erros ao alternar para edição
      setShowModal(false);  // Fecha o modal após salvar
    } else {
      // Exibe um erro caso o nome não seja informado
      alert('Por favor, informe um nome para a daily!');
    }
  };

  // Exibir modal de edição
  const handleEditClick = (daily) => {
    setNewDaily(daily);
    setCurrentDailyId(daily.id);
    setIsEditing(hasPermission);  // Permite edição apenas para criador ou admin
    setShowModal(true);
  };

  const handleCreateNewDaily = () => {
    setIsEditing(false);  // Garantir que estamos em modo de criação
    setNewDaily({ name: '', description: '', activities: 0, team: 0, communication: 0, delivery: 0 });  // Limpar os campos
    setShowModal(true);  // Exibir o modal para criar a nova daily
  };

  return (
    <div className="Daily">
      <Header projectId={projectId} sprintName={sprintName} />

      <Fab
        style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}
        size="large"
        color="primary"
        aria-label="back"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Fab>

      <div className="daily-list">
        {dailys.length > 0 ? (
          dailys.map((daily) => {
            const isCreator = daily.createdBy === currentUserId;

            return (
              <div key={daily.id} className="daily-item">
                {isCreator || hasPermission ? (
                  <DailyComponent
                    id={daily.id}
                    name={daily.name}
                    description={daily.description}
                    activities={daily.activities}
                    team={daily.team}
                    communication={daily.communication}
                    delivery={daily.delivery}
                    createdAt={daily.createdAt}
                    onEdit={() => handleEditClick(daily)}
                    onDelete={hasPermission ? () => deleteDaily(daily.id) : null}
                    isEditable={hasPermission}
                  />
                ) : (
                  <div className="daily-view-only">
                    <h3>{daily.name}</h3>
                    <p><strong>Descrição:</strong> {daily.description}</p>
                    <p><strong>Atividades:</strong> {daily.activities}</p>
                    <p><strong>Equipe:</strong> {daily.team}</p>
                    <p><strong>Comunicação:</strong> {daily.communication}</p>
                    <p><strong>Entrega:</strong> {daily.delivery}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-dailys-message">Nenhuma daily criada ainda.</p>
        )}
      </div>


      {hasPermission && (
        <Fab
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
          color="primary"
          size="large"
          aria-label="add"
          onClick={() => handleCreateNewDaily()}
        >
          <AddIcon />
        </Fab>
      )}

      {showModal && (
        <ModalOverlay onClick={toggleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateDaily}>
              <label>Nome da Daily</label>
              <input
                type="text"
                value={newDaily.name}
                onChange={(e) => setNewDaily({ ...newDaily, name: e.target.value })}
                required
              // Desabilita se estiver visualizando
              />
              <label>Descrição</label>
              <textarea
                value={newDaily.description}
                onChange={(e) => setNewDaily({ ...newDaily, description: e.target.value })}
              // Desabilita se estiver visualizando
              />
              <label>Atividades</label>
              <input
                type="number"
                value={newDaily.activities}
                onChange={(e) => setNewDaily({ ...newDaily, activities: +e.target.value })}
                min="0"
                max="100"
                required
              // Desabilita se estiver visualizando
              />
              <label>Equipe</label>
              <input
                type="number"
                value={newDaily.team}
                onChange={(e) => setNewDaily({ ...newDaily, team: e.target.value })}
                min="0"
                max="100"
                required
                d // Desabilita se estiver visualizando
              />
              <label>Comunicação</label>
              <input
                type="number"
                value={newDaily.communication}
                onChange={(e) => setNewDaily({ ...newDaily, communication: e.target.value })}
                min="0"
                max="100"
                required
              // Desabilita se estiver visualizando
              />
              <label>Entrega</label>
              <input
                type="number"
                value={newDaily.delivery}
                onChange={(e) => setNewDaily({ ...newDaily, delivery: e.target.value })}
                min="0"
                max="100"
                required
              // Desabilita se estiver visualizando
              />
              <button type="submit">Salvar</button>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Daily;
