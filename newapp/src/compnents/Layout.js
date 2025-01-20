import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';  
import SideBar from './SideBar';  

const Layout = ({ children }) => {
    const location = useLocation();

    // Check if the current route is the login page
    const isLoginPage = location.pathname === '/login';

    // If it's the login page, don't render Header and SideNav
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="layout-container">
            <Header />
            <div className="main-content">
                <SideBar />
                    <div className="content">{children}</div>
            </div>
        </div>
    );
};

export default Layout;