import React from 'react';
import EditIcon from '@mui/icons-material/Edit'; // Ícone de lápis para edição
import './Project.css'; // Arquivo de CSS para estilização

const Project = ({ project, onEdit, onClick }) => {
  // Função para formatar a data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="project-container" onClick={onClick}>
      <div className="project-header">
        <h3>{project.name}</h3>
        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation(); // Previne a navegação ao clicar no botão de edição
            onEdit(); // Ação para editar o projeto
          }}
        >
          <EditIcon />
        </button>
      </div>
      <p>Criado em: {formatDate(project.createdAt)}</p>
    </div>
  );
};

export default Project;
