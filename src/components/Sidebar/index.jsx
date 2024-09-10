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

const Sidebar = ({ active }) => {

    const closeSidebar = () => {
        active(false)
    }

    return (
        <Container sidebar={active}>
            <FaTimes onClick={closeSidebar} />
            <Content>
                <SidebarItem Icon={FaHome} Text="Menu" />
                <SidebarItem Icon={FaChartBar} Text="Projetos" />
                <SidebarItem Icon={FaUserAlt} Text="Users" />
                <SidebarItem Icon={FaEnvelope} Text="Mail" />
                <SidebarItem Icon={FaRegCalendarAlt} Text="Calendar" />
                <SidebarItem Icon={FaIdCardAlt} Text="Employees" />
                <SidebarItem Icon={FaRegFileAlt} Text="Reports" />
                <Link to="/" className="sidebar-link">
                    <SidebarItem Icon={FaRegSun} Text="Sair" />
                </Link>
            </Content>
        </Container>
    )
}

export default Sidebar