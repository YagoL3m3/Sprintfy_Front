import React from 'react';
import './Daily.css';
import DeleteIcon from '@mui/icons-material/Delete';

const DailyComponent = ({ name, createdAt, onEdit, onDelete, isEditable }) => {
  const formatDate = (date) => {
    if (date && date.toDate && typeof date.toDate === 'function') {
      const parsedDate = date.toDate();
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(parsedDate);
    }
    if (date instanceof Date && !isNaN(date)) {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    }
    return 'Data inválida';
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(`Você tem certeza que deseja excluir a daily "${name}"?`);
    if (confirmDelete) {
      onDelete();
    }
  };

  return (
    <div className="daily-container" onClick={onEdit}>
      <div className="daily-header">
        <div className="daily-info">
          <h3>{name}</h3>
          <p>Criado em: {formatDate(createdAt)}</p>
        </div>
        
        {/* Exibe o botão de deletar apenas se o usuário tiver permissão */}
        {isEditable && (
          <button onClick={handleDelete} className="delete-button">
            <DeleteIcon style={{ color: 'white' }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyComponent;
