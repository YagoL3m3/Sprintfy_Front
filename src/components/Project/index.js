import React from 'react';
import './Project.css'; // Arquivo de CSS para estilização

const Project = ({ project }) => {
  // Função para formatar a data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="project-container">
      <h3>{project.name}</h3>
      <p>Criado em: {formatDate(project.createdAt)}</p> {/* Exibe a data formatada */}
    </div>
  );
};

export default Project;
