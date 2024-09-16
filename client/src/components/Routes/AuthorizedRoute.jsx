import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { selectLoggedInUser } from '../../redux/features/authSlice';
import jwtDecode from 'jwt-decode';
import './Authorized.css';
import './headerAuth.css';
import HeaderAuth from './HeaderAuth';
import Admin from './menu/Admin';
import Manage from './menu/Manage';
import Staff from './menu/Staff';

const AuthorizedRoute = () => {
    const navigate = useNavigate();
    const { user, accessToken } = useSelector(selectLoggedInUser);
    let role = '';
    if (accessToken) {
        const { UserInfo } = jwtDecode(accessToken);
        role = UserInfo.roles[0].toString();
    }

    const [isSidebarMini, setIsSidebarMini] = useState(window.innerWidth <= 1167);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarMini(window.innerWidth <= 1167);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    if (role === 'admin' || role === 'manage' || role === 'staff') {
        return (
            <div
                id="main-wrapper"
                data-theme="light"
                data-layout="vertical"
                data-navbarbg="skin6"
                data-sidebartype={isSidebarMini ? "mini-sidebar" : "full"}
                data-sidebar-position="fixed"
                data-header-position="fixed"
                data-boxed-layout="full"
                className={`mini-sidebar ${isSidebarVisible ? "show-sidebar" : ""}`}
            >
                <HeaderAuth toggleSidebar={toggleSidebar} user={user} role={role} />
                {role === 'admin' ? (
                    <Admin />
                ) : role === 'manage' ? (
                    <Manage />
                ) : role === 'staff' ? (
                    <Staff />
                ) : null}
                <div className="page-wrapper" style={{ display: 'block' }}>
                    <div className="container-fluid">
                        <div className='row'>
                             <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
       
        return <a href='/unauthorized' />
    }
}

export default AuthorizedRoute;
