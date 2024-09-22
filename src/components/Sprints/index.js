import React from 'react';
import './Sprints.css';

const Sprint = ({ name, createdAt }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Data inválida';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  };

  return (
    <div className="sprint">
      <h3>{name}</h3>
      <p>Criado em: {formatDate(createdAt)}</p>
    </div>
  );
};

export default Sprint;
