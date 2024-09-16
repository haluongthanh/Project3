import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import logoIcon from '../../assets/images/logo-icon.png';
import logoText from '../../assets/images/logo-text.png';
import logoLightText from '../../assets/images/logo-light-text.png';
import feather from 'feather-icons';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { selectLoggedInUser, logout } from '../../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationsLogs, selectNotificationsLogs, resetMutationResult as resetLogMutationResult, selectLogMutationResult } from '../../redux/features/logSlice';
import { getNotificationsOrders, selectNotificationsOrders, resetMutationResult as resetOrderMutationResult, selectOrderMutationResult } from '../../redux/features/orderSlice';
import { formatDate } from '../../utility/formatDate';
import BoxShadowLoader from "../Skeletons/BoxShadowLoader";

const HeaderAuth = ({ toggleSidebar, user, role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);
    const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const bellDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    const toggleNavbar = () => setIsNavbarCollapsed(!isNavbarCollapsed);

    const toggleBellDropdown = () => setIsBellDropdownOpen(!isBellDropdownOpen);

    const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

    const handleClickOutside = (event) => {
        if (bellDropdownRef.current && !bellDropdownRef.current.contains(event.target)) {
            setIsBellDropdownOpen(false);
        }
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
            setIsUserDropdownOpen(false);
        }
    };

    const logoutUser = () => {
        dispatch(logout({ toast }));
        navigate('/');
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        feather.replace();
    }, []);

    const [notifications, setNotifications] = useState([]);
    const [lastChecked, setLastChecked] = useState(new Date());

    const { logs, loading: logsLoading } = useSelector(selectNotificationsLogs);
    const { success: logSuccess } = useSelector(selectLogMutationResult);
    const { orders, loading: ordersLoading } = useSelector(selectNotificationsOrders);
    const { success: orderSuccess } = useSelector(selectOrderMutationResult);

    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        action: '',
        entityType: '',
    });

    useEffect( () => {
        try {
            if (role === 'admin') {
                if (logSuccess) {
                    dispatch(resetLogMutationResult());

                }
                dispatch(getNotificationsLogs({...filters, toast }));

                setNotifications(logs);
            } else if (role === 'staff'||role=='manage') {
                if (orderSuccess) {
                    dispatch(resetOrderMutationResult());

                }
                dispatch(getNotificationsOrders({ ...filters, toast }));

                setNotifications(orders);
            }

        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [role, logSuccess, orderSuccess, logs, orders, filters, dispatch]);
    
    // useEffect(() => {
    //     fetchNotifications();
    //     const intervalId = setInterval(fetchNotifications, 10000);
    
    //     return () => clearInterval(intervalId);
    // }, [fetchNotifications,dispatch]);
    
    
    if(logs==undefined
        ||orders==undefined
    ){
        return <BoxShadowLoader/>
    }
    return (
        <header className="topbar" data-navbarbg="skin6">
            <nav className="navbar top-navbar navbar-expand-md">
                <div className="navbar-header" data-logobg="skin6">
                    <a onClick={toggleSidebar} className="nav-toggler waves-effect waves-light d-block d-md-none" href="#">
                        <i data-feather="menu" className="ti-menu ti-close"></i>
                    </a>

                    <div className="navbar-brand">
                        <a href="/authorized/dashboard">
                            <b className="logo-icon">
                                <img src={logoIcon} alt="homepage" className="dark-logo" />
                                <img src={logoIcon} alt="homepage" className="light-logo" />
                            </b>
                            <span className="logo-text">
                                <img src={logoText} alt="homepage" className="dark-logo" />
                                <img src={logoLightText} className="light-logo" alt="homepage" />
                            </span>
                        </a>
                    </div>

                    <a
                        className={`topbartoggler d-block d-md-none waves-effect waves-light ${!isNavbarCollapsed ? 'collapsed' : ''}`}
                        href="#"
                        onClick={toggleNavbar}
                        aria-controls="navbarSupportedContent"
                        aria-expanded={!isNavbarCollapsed}
                        aria-label="Toggle navigation"
                    >
                        <i data-feather="user" className="ti-more"></i>
                    </a>
                </div>

                <div className={`navbar-collapse collapse ${!isNavbarCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
                    <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
                        <li ref={bellDropdownRef} className={`nav-item dropdown ${isBellDropdownOpen ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle pl-md-3 position-relative"
                                href="#"
                                id="bell"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded={isBellDropdownOpen ? "true" : "false"}
                                onClick={toggleBellDropdown}
                            >
                                <span><i data-feather="bell" className="svg-icon"></i></span>
                                <span className="badge badge-primary notify-no rounded-circle">{notifications.length}</span>
                            </a>
                            <div className={`dropdown-menu dropdown-menu-left mailbox animated bounceInDown ${isBellDropdownOpen ? 'show' : ''}`}>
                                <ul className="list-style-none">
                                    {notifications.length > 0 ? (
                                        notifications.map(notification => (
                                            <li key={notification._id}>
                                                <div className="message-center notifications position-relative">
                                                    <a
                                                        href={role === 'admin'
                                                            ? `/authorized/log/${notification._id}`
                                                            : `/authorized/order/${notification._id}`}
                                                        className="message-item d-flex align-items-center border-bottom px-3 py-2"
                                                    >
                                                        <div className="btn btn-danger rounded-circle btn-circle">
                                                            <i data-feather="airplay" className="text-white"></i>
                                                        </div>
                                                        <div className="w-75 d-inline-block v-middle pl-2">
                                                            <h6 className="message-title mb-0 mt-1">{notification.title || `order ${notification.orderCode}`}</h6>
                                                            <span className="font-12 text-nowrap d-block text-muted">{formatDate(notification.createdAt)}</span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <div className="message-center">
                                                <span className="font-12 text-muted">Không có thông báo mới</span>
                                            </div>
                                        </li>
                                    )}
                                    <li>
                                        <a className="nav-link pt-3 text-center text-dark" href={role==='admin'?`/authorized/loglist`:`/authorized/orderlist`}>
                                            {role==='admin'?
                                            <strong>Kiểm tra tất cả thông báo</strong>:
                                            <strong>Kiểm tra tất cả đơn hàng</strong>}
                                            <i className="fa fa-angle-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                    <ul className="navbar-nav float-right">
                        <li ref={userDropdownRef} className={`nav-item dropdown ${isUserDropdownOpen ? 'show' : ''}`}>
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded={isUserDropdownOpen ? "true" : "false"}
                                onClick={toggleUserDropdown}
                            >
                                <img src={IMAGE_BASEURL + user.avatar.url} alt="user" className="rounded-circle" width="40" />
                                <span className="ml-2 d-none d-lg-inline-block">
                                    <span>Xin Chào,</span>
                                    <span className="text-dark">{user.name}</span>
                                    <i data-feather="chevron-down" className="svg-icon"></i>
                                </span>
                            </a>
                            <div className={`dropdown-menu dropdown-menu-right user-dd animated flipInY ${isUserDropdownOpen ? 'show' : ''}`}>
                                <a className="dropdown-item" href="/profile">
                                    <i data-feather="user" className="svg-icon mr-2 ml-1"></i> My Profile
                                </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" onClick={logoutUser}>
                                    <i data-feather="power" className="svg-icon mr-2 ml-1"></i> Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default HeaderAuth;
