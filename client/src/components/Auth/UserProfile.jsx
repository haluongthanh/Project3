import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedInUser, logout } from '../../redux/features/authSlice';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import jwtDecode from 'jwt-decode';
import UpdateProfile from './UpdateProfile';
import MyOrders from '../Order/MyOrders';
import UpdatePassword from './UpdatePassword';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile'); // State để theo dõi tab hiện tại

  const hash = location.hash;


  const { user, accessToken } = useSelector(selectLoggedInUser);
  const { UserInfo } = jwtDecode(accessToken);

  useEffect(() => {
    if (hash === '#orders') {
      setActiveTab('orders');
    } else if (hash === '#password') {
      setActiveTab('password');
    } else {
      setActiveTab('profile');
    }
  }, [hash]);

  const logoutUser = () => {
   
      dispatch(logout({ toast }));
      navigate('/');
    
  };

  return (
    <div className='wrapbox-content-account'>
      <div className="container-fluid" id='profile'>
        <div className='row'>
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 colleft" >
            <div className="left-sidebar-profile">
              <div className="left-sidebar__avatar">
                <div className="icon">
                  <img src={IMAGE_BASEURL + user.avatar.url} style={{ borderRadius: '50%' }} />
                </div>
                <div className="info">
                  <div className="customer-name">{user.name}</div>
                  <div className="customer-phone"></div>
                </div>
              </div>
              <ul className="left-sidebar__list tabbed-nav">
                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    id="v-pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-profile"
                    aria-selected={activeTab === 'profile'}
                    onClick={() => setActiveTab('profile')}
                  >
                    Thông Tin Tài Khoản
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                    id="v-pills-password-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-password"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-password"
                    aria-selected={activeTab === 'password'}
                    onClick={() => setActiveTab('password')}
                  >
                    Đổi Mật Khẩu
                  </button>
                  <button
                    className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                    id="v-pills-orders-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-orders"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-orders"
                    aria-selected={activeTab === 'orders'}
                    onClick={() => setActiveTab('orders')}
                  >
                    Đơn Hàng
                  </button>
                  <button className="nav-link" id="v-pills-settings-tab" type="button" role="tab" onClick={logoutUser}>Đăng Xuất</button>
                </div>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-9 colright" id='account-row'>
            <div className="tab-content" id="v-pills-tabContent">
              <div className={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''}`} id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                <UpdateProfile />
              </div>
              <div className={`tab-pane fade ${activeTab === 'password' ? 'show active' : ''}`} id="v-pills-password" role="tabpanel" aria-labelledby="v-pills-password-tab">
                <UpdatePassword />
              </div>
              <div className={`tab-pane fade ${activeTab === 'orders' ? 'show active' : ''}`} id="v-pills-orders" role="tabpanel" aria-labelledby="v-pills-orders-tab">
                <MyOrders />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
