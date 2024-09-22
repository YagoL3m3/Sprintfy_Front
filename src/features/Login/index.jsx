// src/components/LoginForm.js
import React, { useState } from 'react';
import './Login.css'; // Importar o arquivo de estilos
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você pode adicionar a lógica de autenticação
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className='form-container'>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <Link className='link-botao' to="/Menu">Login provisorio</Link>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
