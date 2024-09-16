import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const SlideBar = () => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState(null);
    const [openMenus, setOpenMenus] = useState([]);

    const handleLinkClick = (link, e) => {
        e.preventDefault();
        navigate(link); 
        setActiveLink(link);
    };

    const handleSidebarToggle = (menu) => {
        setOpenMenus((prevOpenMenus) => {
            if (prevOpenMenus.includes(menu)) {
                return prevOpenMenus.filter(item => item !== menu);
            } else {
                return [...prevOpenMenus, menu];
            }
        });
    };

    return (
        <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar" data-sidebarbg="skin6">
                <nav className="sidebar-nav">
                    <ul id="sidebarnav">
                        <li className={`sidebar-item ${activeLink === 'dashboard' ? 'selected' : ''}`}>
                            <a 
                                className={`sidebar-link ${activeLink === 'dashboard' ? 'active' : ''}`} 
                                href=""
                                onClick={(e) => handleLinkClick('dashboard', e)}
                                aria-expanded="false"
                            >
                                <i data-feather="home" className="feather-icon"></i>
                                <span className="hide-menu">Dashboard</span>
                            </a>
                        </li>
                        <li className="list-divider"></li>
                       

                        <li className="list-divider"></li>
                        <li className="nav-small-cap"><span className="hide-menu">Manage</span></li>

                        {[
                            { menu: 'category', label: 'Danh Mục' },
                            { menu: 'brand', label: 'Thương Hiệu' },
                            { menu: 'product', label: 'Sản Phẩm' },
                            { menu: 'banner', label: 'Biểu Ngữ' },
                            { menu: 'blogcategory', label: 'Danh Mục Tin' },
                            { menu: 'blog', label: 'Tin' }
                        ].map(({ menu, label }) => (
                            <li key={menu} className={`sidebar-item ${openMenus.includes(menu) ? 'selected' : ''}`}>
                                <a
                                    className={`sidebar-link has-arrow ${activeLink === menu ? 'active' : ''}`}
                                    href=""
                                    onClick={(e) => {
                                        handleSidebarToggle(menu);
                                        e.preventDefault();
                                    }}
                                    aria-expanded={openMenus.includes(menu)}
                                >
                                    <i data-feather="file" className="feather-icon"></i>
                                    <span className="hide-menu">{label}</span>
                                </a>
                                <ul className={`collapse first-level base-level-line ${openMenus.includes(menu) ? 'in' : ''}`}>
                                    <li className="sidebar-item">
                                        <a
                                            href=""
                                            className={`sidebar-link ${activeLink === `${menu}` ? 'active' : ''}`}
                                            onClick={(e) => handleLinkClick(menu, e)}
                                        >
                                            <span className="hide-menu">Tạo Mới {label} </span>
                                        </a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a
                                            href=""
                                            className={`sidebar-link ${activeLink === `${menu}list` ? 'active' : ''}`}
                                            onClick={(e) => handleLinkClick(`${menu}list`, e)}
                                        >
                                            <span className="hide-menu"> {label} </span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        ))}

                        <li className={`sidebar-item ${activeLink === 'reviewlist' ? 'selected' : ''}`}>
                            <a 
                                className={`sidebar-link ${activeLink === 'reviewlist' ? 'active' : ''}`} 
                                href=""
                                onClick={(e) => handleLinkClick('reviewlist', e)}
                                aria-expanded="false"
                            >
                                <i data-feather="star" className="feather-icon"></i>
                                <span className="hide-menu"> Đánh Giá</span>
                            </a>
                        </li>
                        <li className={`sidebar-item ${activeLink === 'orderlist' ? 'selected' : ''}`}>
                            <a 
                                className={`sidebar-link ${activeLink === 'orderlist' ? 'active' : ''}`} 
                                href=""
                                onClick={(e) => handleLinkClick('orderlist', e)}
                                aria-expanded="false"
                            >
                                <i data-feather="shopping-cart" className="feather-icon"></i>
                                <span className="hide-menu"> Đơn Hàng</span>
                            </a>
                        </li>
                        
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default SlideBar;
