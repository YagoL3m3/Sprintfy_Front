import React from 'react';
import './Daily.css'; // Arquivo de CSS para estilização

const Daily = ({ daily }) => {
  // Função para formatar a data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="daily-container">
      <h3>{daily.name}</h3>
      <p>Criado em: {daily.createdAt ? formatDate(daily.createdAt) : 'Data inválida'}</p>
    </div>
  );
};

export default Daily;
