import React, { useState } from 'react';

// Componente para o formulário de criação de projetos
const ProjectForm = ({ addProject, closeForm }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName) {
      const newProject = {
        id: Math.random(),
        name: projectName,
        date: new Date().toLocaleDateString(),
      };
      addProject(newProject);
      closeForm(); // Fecha o formulário após a criação
    }
  };

  return (
    <div className="form-overlay">
      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          placeholder="Nome do projeto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <button type="submit">Criar Projeto</button>
      </form>
    </div>
  );
};