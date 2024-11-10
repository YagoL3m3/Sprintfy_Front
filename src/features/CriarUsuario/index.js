import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateCurrentUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './CriarUsuario.css';

const CriarUsuario = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('manager');
    const [error, setError] = useState('');
    const [previousUser, setPreviousUser] = useState(null);
    const navigate = useNavigate();

    // Armazena o usuário atual antes de criar um novo usuário
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setPreviousUser(user);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Salva o novo usuário no Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                email: user.email,
                role: role,
            });
    
            // Desassocia o novo usuário da sessão atual
            await updateCurrentUser(auth, null);
    
            // Reautentica o usuário anterior após criar o novo usuário
            if (previousUser) {
                await signInWithEmailAndPassword(auth, previousUser.email, password);
            }
    
            alert('Usuário criado com sucesso!');
        } catch (error) {
            setError(error.message);
        }
    };
    

    return (
        <div className="container">
            <div className="form">
                <Link to="/Menu" className="back-link">
                    <span role="img" aria-label="voltar" className="back-arrow">⬅️</span>
                </Link>
                <h1>Criar Novo Usuário</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleCreateUser}>
                    <div>
                        <label className="label">Email:</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="input" 
                        />
                    </div>
                    <div>
                        <label className="label">Senha:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="input" 
                        />
                    </div>
                    <div>
                        <label className="label">Papel:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="select">
                            <option value="manager">Gerente</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" className="button">Criar Usuário</button>
                </form>
            </div>
        </div>
    );
};

export default CriarUsuario;
