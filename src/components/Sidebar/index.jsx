import React from 'react'
import { Container, Content } from './styles'
import {
    FaTimes,
    FaHome,
    FaEnvelope,
    FaRegSun,
    FaUserAlt,
    FaIdCardAlt,
    FaRegFileAlt,
    FaRegCalendarAlt,
    FaChartBar
} from 'react-icons/fa'

import SidebarItem from '../SidebarItem'
import { Link } from 'react-router-dom';
import './Sidebar.css'
import User from '../User';

const Sidebar = ({ active }) => {

    const closeSidebar = () => {
        active(false)
    }

    return (
        <Container sidebar={active}>
            <FaTimes onClick={closeSidebar} />
            <Content className='Itens'>
                <User usuario='Brunao' Id='68952707' />
                <Link to="/Menu" className="sidebar-link">
                    <SidebarItem Icon={FaHome} Text="Menu" />
                </Link>

                <Link to="/Projetos" className="sidebar-link">
                    <SidebarItem Icon={FaChartBar} Text="Projetos" />
                </Link>

                <Link to="/" className="sidebar-link">
                    <SidebarItem Icon={FaRegSun} Text="Sair" />
                </Link>
            </Content>
        </Container>
    )
}

export default Sidebar