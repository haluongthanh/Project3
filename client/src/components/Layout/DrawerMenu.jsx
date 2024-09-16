import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IconButton } from '@mui/material';
import { selectWebsite, getWebsite } from '../../redux/features/websiteSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectLoggedInUser } from '../../redux/features/authSlice';
import { URL } from '../../constants/baseURL';

const DrawerMenu = ( { website,user }) => {
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);


    useEffect(() => {
        dispatch(getWebsite({ toast }));
    }, [dispatch]);

    const handleOrderTrackingClick = () => {
        if (user) {
            window.location.href = `${URL}/profile#orders`
        } else {
            toast.info('Vui lòng đăng nhập để tra cứu đơn hàng của bạn.');
        }
    };


    return (
        <>
            <IconButton onClick={() => setOpen(true)} sx={{ color: '#fff' }}>
                <MenuIcon />
            </IconButton>
            <SwipeableDrawer
                anchor='left'
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => { }}
            >
                <nav className='mnwrapper'>
                    <a href='/' className={({ isActive }) => isActive ? 'active' : ''}>
                        <i className="fas fa-home"></i> Trang Chủ
                    </a>

                    <a href="/collection/all">
                        <i className="fas fa-shopping-cart"></i> Sản Phẩm
                    </a>
                    <a href='/blogs/all' className={({ isActive }) => isActive ? 'active' : ''}>
                        <span class="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5 3.25H17.875C18.1734 3.25 18.4595 3.36853 18.6705 3.5795C18.8815 3.79048 19 4.07663 19 4.375V16.75C19 17.3467 18.7629 17.919 18.341 18.341C17.919 18.7629 17.3467 19 16.75 19M16.75 19C16.1533 19 15.581 18.7629 15.159 18.341C14.7371 17.919 14.5 17.3467 14.5 16.75V2.125C14.5 1.82663 14.3815 1.54048 14.1705 1.32951C13.9595 1.11853 13.6734 1 13.375 1H2.125C1.82663 1 1.54048 1.11853 1.32951 1.32951C1.11853 1.54048 1 1.82663 1 2.125V15.625C1 16.5201 1.35558 17.3786 1.98851 18.0115C2.62145 18.6444 3.47989 19 4.375 19H16.75Z" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M4 11.5L11 11.5" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M4 15L11 15" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round"></path>
                            <rect x="4" y="5" width="7" height="3" rx="1" stroke="currentcolor"></rect>
                        </svg></span> Tin
                    </a>
                    <a href='#' onClick={handleOrderTrackingClick} className={({ isActive }) => isActive ? 'active' : ''}>

                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.9637 2.95195H10.7919C10.373 1.79337 9.27584 0.954399 7.97918 0.954399C6.68252 0.954399 5.58535 1.79337 5.16643 2.95195H1.99461C0.897441 2.95195 -0.000244141 3.85085 -0.000244141 4.9495L0.0462926 21.0481C0.0462926 22.1467 0.943978 23.0456 2.04115 23.0456H8.13543C7.54533 22.4721 7.32914 22.1792 6.98295 21.4322H1.67845L1.63191 4.58457H3.98947V5.39127C3.98947 6.48992 4.88715 7.38882 5.98432 7.38882H9.97404C11.0712 7.38882 11.9689 6.48992 11.9689 5.39127V4.58457H14.2811V10.4389C14.9893 10.5388 15.3402 10.7486 15.9586 11.0382V4.9495C15.9586 3.85085 15.0609 2.95195 13.9637 2.95195ZM7.97918 5.39127C7.34445 5.39127 6.52838 4.98792 6.52838 3.95073C6.52838 3.37451 6.93641 2.56781 7.97918 2.56781C8.52777 2.56781 9.38465 2.98544 9.38465 3.95073C9.38465 4.91601 8.65794 5.39127 7.97918 5.39127ZM13.0129 13.0579C10.26 13.0579 8.02572 15.2951 8.02572 18.0517C8.02572 20.8084 10.26 23.0456 13.0129 23.0456C15.7658 23.0456 18 20.8084 18 18.0517C18 15.2951 15.7658 13.0579 13.0129 13.0579ZM14.2995 20.0493L12.6538 18.4013C12.5607 18.3085 12.5071 18.1832 12.5042 18.0517V15.5648C12.5042 15.2851 12.7236 15.0654 13.0029 15.0654C13.2822 15.0654 13.5016 15.2851 13.5016 15.5648V17.852L14.9977 19.3501C15.0443 19.3959 15.0814 19.4504 15.1069 19.5106C15.1323 19.5708 15.1456 19.6354 15.1459 19.7007C15.1462 19.7661 15.1336 19.8308 15.1088 19.8913C15.084 19.9517 15.0474 20.0066 15.0013 20.0528C14.9551 20.099 14.9003 20.1356 14.84 20.1605C14.7796 20.1853 14.7149 20.198 14.6497 20.1976C14.5844 20.1973 14.5199 20.184 14.4598 20.1586C14.3997 20.1331 14.3452 20.096 14.2995 20.0493Z" fill="white"></path>
                            </svg>
                        </span> Tra Cứu Đơn Hàng
                    </a>
                    <a href={`tel:${website[0]?.hotline}`} className='hotline'>
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.37476 11.9262H3.24976C2.00711 11.9262 0.999756 12.9386 0.999756 14.1876V17.5797C0.999756 18.8286 2.00711 19.8411 3.24976 19.8411H4.37476C5.6174 19.8411 6.62475 18.8286 6.62475 17.5797V14.1876C6.62475 12.9386 5.6174 11.9262 4.37476 11.9262Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M16.7497 11.9264H15.6247C14.3821 11.9264 13.3747 12.9389 13.3747 14.1878V17.5799C13.3747 18.8289 14.3821 19.8413 15.6247 19.8413H16.7497C17.9923 19.8413 18.9997 18.8289 18.9997 17.5799V14.1878C18.9997 12.9389 17.9923 11.9264 16.7497 11.9264Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M1 14.1876V10.7955C1 8.39644 1.94821 6.09564 3.63604 4.39925C5.32387 2.70287 7.61305 1.74985 10 1.74985C12.3869 1.74985 14.6761 2.70287 16.364 4.39925C18.0518 6.09564 19 8.39644 19 10.7955V14.1876" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M8.19063 23.9014C5.34558 24.0148 1.68793 22.801 1.86299 19.2078L3.79676 19.2078C3.79676 21.729 5.88816 22.4163 8.19063 22.2935C8.25136 21.9719 8.52587 21.729 8.85602 21.729H11.7511C12.1258 21.729 12.3484 22.2388 12.3484 22.6244V23.5522C12.3484 23.9377 12.0447 24.2502 11.67 24.2502H8.77488C8.5245 24.2502 8.30818 24.1093 8.19063 23.9014Z" fill="white"></path>
                            </svg>
                        </span> Hotline: {website[0].hotline}
                    </a>
                </nav>
            </SwipeableDrawer>
        </>
    );
};

export default DrawerMenu;
