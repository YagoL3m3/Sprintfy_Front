import styled from 'styled-components';

export const Container = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1A202C; 
  box-shadow: 0 0 20px 3px;
  padding: 0 20px;

  > svg {
    color: white;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  h1 {
    color: white;
    font-size: 24px;
    margin-left: 50px;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    height: auto;
    padding: 20px;

    h1 {
      margin-left: 0;
      font-size: 20px;
    }

    button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      font-size: 14px;
    }

    > svg {
      position: absolute;
      top: 15px;
      left: 15px;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 18px;
    }

    button {
      font-size: 12px;
      padding: 8px;
    }

    > svg {
      width: 25px;
      height: 25px;
    }
  }
`;

// Modal Styles
// Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);  // Semi-transparente para o fundo
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;

  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    margin: 0 20px; /* Adiciona margem ao redor do formulário */
  }

  label {
    margin-bottom: 10px;
    color: #555;
    font-size: 16px;
  }

  input {
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
    width: 100%;
  }

  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }

  button[type="button"] {
    background-color: #ccc;
    margin-left: 10px;

    &:hover {
      background-color: #999;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    padding: 15px;

    h2 {
      font-size: 20px;
    }

    form {
      margin: 0 10px; /* Ajuste de margem para telas menores */
    }

    input {
      font-size: 14px;
      padding: 8px;
    }

    button {
      font-size: 14px;
      padding: 10px;
      width: 100%;
    }

    div {
      flex-direction: column;
      gap: 10px;
    }

    button[type="button"] {
      margin-left: 0;
    }
  }
`;
