import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Project.css';

const Project = ({ project, onEdit, onDelete, onClick, showEditButton, showDeleteButton }) => {
  const formatDate = (date) => {
    const parsedDate = date ? date.toDate() : new Date();
    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(parsedDate);
  };

  return (
    <div className="project-container" onClick={onClick}>
      <div className="project-header">
        <h3>{project.name}</h3>
        <div className="project-buttons-container"> {/* Alterado para project-buttons-container */}
          {showEditButton && (
            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <EditIcon />
            </button>
          )}
          {showDeleteButton && (
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon />
            </button>
          )}
        </div>
      </div>

      <p className='project-data'>Criado em: {formatDate(project.createdAt)}</p>
      {project.createdByName && (
        <p>Criado por: {project.createdByName}</p>
      )}
    </div>
  );
};

export default Project;
