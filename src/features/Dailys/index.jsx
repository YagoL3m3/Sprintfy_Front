import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ModalOverlay, ModalContent } from './styles';
import DailyComponent from '../../components/Daily';
import Draggable from 'react-draggable';

const Daily = () => {
  const { sprintName } = useParams();
  const navigate = useNavigate();
  const [dailys, setDailys] = useState([]);
  const [newDaily, setNewDaily] = useState({
    name: '',
    description: '',
    activities: 0,
    team: 0,
    communication: 0,
    delivery: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Carregar dailys do localStorage quando o componente é montado
  useEffect(() => {
    const savedDailys = JSON.parse(localStorage.getItem(`dailys_${sprintName}`)) || [];
    console.log("Dailys carregadas:", savedDailys); // Log para depuração
    setDailys(savedDailys);
  }, [sprintName]);

  // Salvar dailys no localStorage sempre que elas mudarem
  useEffect(() => {
    console.log("Dailys salvas:", dailys); // Log para depuração
    localStorage.setItem(`dailys_${sprintName}`, JSON.stringify(dailys));
  }, [dailys, sprintName]);

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateOrUpdateDaily = (e) => {
    e.preventDefault();
    if (newDaily.name.trim()) {
      const updatedDailys = isEditing
        ? dailys.map((daily, index) => (index === currentIndex ? { ...daily, ...newDaily } : daily))
        : [...dailys, { ...newDaily, createdAt: new Date().toISOString() }];

      console.log("Atualizando dailys:", updatedDailys); // Log para depuração
      setDailys(updatedDailys);
      setNewDaily({
        name: '',
        description: '',
        activities: 0,
        team: 0,
        communication: 0,
        delivery: 0,
      });
      setShowModal(false);
      setIsEditing(false);
    }
  };

  const handleEditDaily = (index) => {
    setNewDaily(dailys[index]);
    setCurrentIndex(index);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDrag = (e, data, dailyName) => {
    if (data.x < -100) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir a daily "${dailyName}"?`);
      if (confirmed) {
        setDailys(dailys.filter(daily => daily.name !== dailyName));
      }
    }
  };

  return (
    <div className='Daily'>
      <Header projectName={sprintName} />

      <div className="daily-list"
        style={dailys.length === 0
          ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center', color: 'white' }
          : {}}>
        {dailys.length > 0 ? (
          dailys.map((daily, index) => (
            <Draggable
              key={index}
              onStop={(e, data) => handleDrag(e, data, daily.name)}
              axis="x"
              bounds={{ left: -200, top: 0, right: 0, bottom: 0 }}
            >
              <div onClick={() => handleEditDaily(index)}>
                <DailyComponent daily={daily} />
              </div>
            </Draggable>
          ))
        ) : (
          <p>Nenhuma daily criada ainda.</p>
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
          setNewDaily({
            name: '',
            description: '',
            activities: 0,
            team: 0,
            communication: 0,
            delivery: 0,
          });
          setIsEditing(false);
          toggleModal();
        }}
      >
        <AddIcon />
      </Fab>

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

      {showModal && (
        <ModalOverlay onClick={toggleModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? 'Editar Daily' : 'Nova Daily'}</h2>
            <form onSubmit={handleCreateOrUpdateDaily}>
              <label>Nome da Daily</label>
              <input
                type="text"
                value={newDaily.name}
                onChange={(e) => setNewDaily({ ...newDaily, name: e.target.value })}
                placeholder="Digite o nome da daily"
                required
              />
              <label>Descrição</label>
              <textarea
                value={newDaily.description}
                onChange={(e) => setNewDaily({ ...newDaily, description: e.target.value })}
                placeholder="Digite a descrição da daily"
                required
              />
              <label>Atividades (0 a 100)</label>
              <input
                type="number"
                value={newDaily.activities}
                onChange={(e) => setNewDaily({ ...newDaily, activities: Math.max(0, Math.min(100, e.target.value)) })}
                min="0"
                max="100"
                required
              />
              <label>Equipe (0 a 100)</label>
              <input
                type="number"
                value={newDaily.team}
                onChange={(e) => setNewDaily({ ...newDaily, team: Math.max(0, Math.min(100, e.target.value)) })}
                min="0"
                max="100"
                required
              />
              <label>Comunicação (0 a 100)</label>
              <input
                type="number"
                value={newDaily.communication}
                onChange={(e) => setNewDaily({ ...newDaily, communication: Math.max(0, Math.min(100, e.target.value)) })}
                min="0"
                max="100"
                required
              />
              <label>Entrega (0 a 100)</label>
              <input
                type="number"
                value={newDaily.delivery}
                onChange={(e) => setNewDaily({ ...newDaily, delivery: Math.max(0, Math.min(100, e.target.value)) })}
                min="0"
                max="100"
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

export default Daily;
