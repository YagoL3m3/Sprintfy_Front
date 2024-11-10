import React from 'react';
import './Sprints.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; // Importar o ícone de excluir

const Sprint = ({ name, createdAt, onEdit, onDelete, onClick, userRole, isProjectOwner }) => {
  // Função para formatar a data
  const formatDate = (date) => {  
    const parsedDate = date ? date.toDate() : new Date(); // Verifique se a data existe e converte para Date
    if (isNaN(parsedDate.getTime())) {
      return 'Data inválida'; // Retorna 'Data inválida' se a data não for válida
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(parsedDate);
  };

  return (
    <div className="sprint-container" onClick={onClick}> {/* Use onClick passado como prop */}
      <div className="sprint-header">
        <h3>{name}</h3>
        {(userRole === 'admin' || isProjectOwner) && ( // Exibe os botões de editar e excluir se o usuário for admin ou dono do projeto
          <div className="sprint-buttons-container">
            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation(); // Previne a navegação ao clicar no botão de edição
                onEdit(); // Chama a função de edição
              }}
            >
              <EditIcon />
            </button>
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // Previne a navegação ao clicar no botão de excluir
                const confirmDelete = window.confirm(`Você tem certeza que deseja excluir a sprint "${name}"?`);
                if (confirmDelete) {
                  onDelete(); // Chama a função de exclusão somente se o usuário confirmar
                }
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>
      <p>Criado em: {formatDate(createdAt)}</p>
    </div> 
  );
};

export default Sprint;
