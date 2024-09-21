import React from 'react';
import './Sprints.css'

const Sprint = ({ name }) => {
  return (
    <div className="sprint">
      <h3>{name}</h3>
    </div>
  );
};

export default Sprint;
