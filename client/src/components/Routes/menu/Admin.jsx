import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaHome, FaGlobe, FaClipboardList, FaStar, FaShoppingCart, FaUsers, FaTag, FaBoxes, FaBullhorn, FaNewspaper, FaFolder } from 'react-icons/fa';  // Import các biểu tượng
import { FiFile } from 'react-icons/fi'; // Một số biểu tượng Feather

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
                                <FaHome className="feather-icon" />  {/* Biểu tượng nhà */}
                                <span className="hide-menu">Dashboard</span>
                            </a>
                        </li>
                        <li className="list-divider"></li>
                        <li className="nav-small-cap"><span className="hide-menu">Applications</span></li>

                        <li className={`sidebar-item ${activeLink === 'website' ? 'selected' : ''}`}>
                            <a
                                className={`sidebar-link ${activeLink === 'website' ? 'active' : ''}`}
                                href=""
                                onClick={(e) => handleLinkClick('website', e)}
                                aria-expanded="false"
                            >
                                <FaGlobe className="feather-icon" />  {/* Biểu tượng globe */}
                                <span className="hide-menu">Website</span>
                            </a>
                        </li>

                        <li className={`sidebar-item ${activeLink === 'loglist' ? 'selected' : ''}`}>
                            <a
                                className={`sidebar-link ${activeLink === 'loglist' ? 'active' : ''}`}
                                href=""
                                onClick={(e) => handleLinkClick('loglist', e)}
                                aria-expanded="false"
                            >
                                <FaClipboardList className="feather-icon" />  {/* Biểu tượng clipboard */}
                                <span className="hide-menu">Check Log</span>
                            </a>
                        </li>

                        <li className="list-divider"></li>
                        <li className="nav-small-cap"><span className="hide-menu">Quản Lý</span></li>

                        {[
                            { menu: 'category', label: 'Danh Mục', icon: <FaFolder className="feather-icon"/> },  
                            { menu: 'brand', label: 'Thương Hiệu', icon: <FaTag className="feather-icon"/> },    
                            { menu: 'product', label: 'Sản Phẩm', icon: <FaBoxes className="feather-icon"/> }, 
                            { menu: 'banner', label: 'Biểu Ngữ', icon: <FaBullhorn className="feather-icon"/> },
                            { menu: 'blogcategory', label: 'Danh Mục Tin', icon: <FaFolder className="feather-icon"/> }, 
                            { menu: 'blog', label: 'Tin', icon: <FaNewspaper className="feather-icon"/> }      
                        ].map(({ menu, label, icon }) => (
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
                                    {icon}  {/* Biểu tượng động */}
                                    <span className="hide-menu">{label}</span>
                                </a>
                                <ul className={`collapse first-level base-level-line ${openMenus.includes(menu) ? 'in' : ''}`}>
                                    <li className="sidebar-item">
                                        <a
                                            href=""
                                            className={`sidebar-link ${activeLink === `${menu}` ? 'active' : ''}`}
                                            onClick={(e) => handleLinkClick(menu, e)}
                                        >
                                            <span className="hide-menu">Tạo Mới {label}</span>
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
                                <FaStar className="feather-icon" />  {/* Biểu tượng ngôi sao */}
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
                                <FaShoppingCart className="feather-icon" />  {/* Biểu tượng giỏ hàng */}
                                <span className="hide-menu"> Đơn Hàng</span>
                            </a>
                        </li>
                        <li className={`sidebar-item ${activeLink === 'userlist' ? 'selected' : ''}`}>
                            <a
                                className={`sidebar-link ${activeLink === 'userlist' ? 'active' : ''}`}
                                href=""
                                onClick={(e) => handleLinkClick('userlist', e)}
                                aria-expanded="false"
                            >
                                <FaUsers className="feather-icon" />  {/* Biểu tượng người dùng */}
                                <span className="hide-menu"> Người Dùng</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default SlideBar;
