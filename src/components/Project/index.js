import React, { useState } from 'react';
import './Project.css'; // Arquivo de CSS para estilização

const Project = ({ project, sprints }) => {
  const [showSprints, setShowSprints] = useState(false);

  const toggleSprints = () => {
    setShowSprints(!showSprints);
  };

  return (
    <div className="project-container" onClick={toggleSprints}>
      <h3>{project.name}</h3>
      {showSprints && (
        <div className="sprints-container">
          <h4>Sprints</h4>
          <ul>
            {sprints.length > 0 ? (
              sprints.map((sprint, index) => <li key={index}>{sprint}</li>)
            ) : (
              <p>Nenhuma sprint encontrada.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Project;
