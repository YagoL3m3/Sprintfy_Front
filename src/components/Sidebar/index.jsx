// Sidebar.js
import React, { useEffect, useState } from 'react';
import { Container, Content } from './styles';
import {
    FaTimes,
    FaHome,
    FaRegSun,
    FaChartBar
} from 'react-icons/fa';
import { RiAdminFill } from "react-icons/ri";
import SidebarItem from '../SidebarItem';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import User from '../User';
import { auth, firestore } from '../../firebaseConfig'; // Importando firestore
import { doc, getDoc } from 'firebase/firestore'; // Importando métodos do Firestore

const Sidebar = ({ active }) => {
    const [userEmail, setUserEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
                const emailWithoutDomain = user.email.split('@')[0]; // Obtém a parte do email antes do @
                setUserEmail(emailWithoutDomain); // Armazena apenas a parte antes do @

                // Verifica o papel do usuário no Firestore
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === 'admin'); // Verifica se o papel é admin
                }
            } else {
                setUserEmail(''); // Caso não tenha um usuário logado
                setIsAdmin(false); // Reseta a verificação de admin
            }
        });

        return () => unsubscribe(); // Limpa o ouvinte quando o componente é desmontado
    }, []);

    const closeSidebar = () => {
        active(false);
    };

    return (
        <Container sidebar={active}>
            <FaTimes onClick={closeSidebar} />
            <Content className='Itens'>
                <User usuario={userEmail} Id='' /> {/* Passa o email sem a parte após o @ para o componente User */}
                <Link to="/Menu" className="sidebar-link">
                    <SidebarItem Icon={FaHome} Text="Menu" />
                </Link>

                <Link to="/Projetos" className="sidebar-link">
                    <SidebarItem Icon={FaChartBar} Text="Projetos" />
                </Link>

                {/* Renderiza o link "Criar Usuário" apenas se o usuário for admin */}
                {isAdmin && (
                    <Link to="/criar-usuario" className="sidebar-link">
                        <SidebarItem Icon={RiAdminFill} Text="Criar Usuário" />
                    </Link>
                )}

                <Link to="/" className="sidebar-link">
                    <SidebarItem Icon={FaRegSun} Text="Sair" />
                </Link>
            </Content>
        </Container>
    );
};

export default Sidebar;
