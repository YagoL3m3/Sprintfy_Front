import React from 'react';
import './Sprints.css';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const Sprint = ({ name, createdAt, onEdit }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return 'Data inválida';
    }
    
    const d = new Date(date);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  };

  const handleClick = () => {
    navigate(`/sprint/${name}`);
  };

  return (
    <div className="sprint-container" onClick={handleClick}>
      <div className="sprint-header">
        <h3>{name}</h3>
        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation(); // Previne a navegação
            onEdit(); // Chama a função de edição
          }}
        >
          <EditIcon />
        </button>
      </div>
      <p>Criado em: {formatDate(createdAt)}</p>
    </div>
  );
};

export default Sprint;
