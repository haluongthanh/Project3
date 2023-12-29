import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {selectLoggedInUser, updateProfile,logout} from '../../redux/features/authSlice';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import jwtDecode from 'jwt-decode';
import UpdateProfile from './UpdateProfile';
import MyOrders from '../Order/MyOrders';
import UpdatePassword from './UpdatePassword';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import './Profile.css'
import { useLocation } from 'react-router-dom';

const UserProfile = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location = useLocation();

  // Lấy hash từ đối tượng location
  const hash = location.hash;

  // In ra console để kiểm tra
  console.log('Hash:', hash);

  const {user,accessToken}=useSelector(selectLoggedInUser);
  const {UserInfo}=jwtDecode(accessToken);
  const logoutUser=()=>{
    const confirmLogout = window.confirm("Bạn có muốn đăng xuất không?");

    if (confirmLogout) {
      // Nếu người dùng xác nhận, thực hiện đăng xuất
      dispatch(logout({ toast }));
      navigate('/');
    }
   
  };
  return (

    <div className='wrapbox-content-account'>
      <div className="container-fluid">
        <div className='row'>
          <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-3 colleft" >
            <div className="left-sidebar">
              <div className="left-sidebar__avatar">
                  <div className="icon">
                    <img src={IMAGE_BASEURL+user.avatar.url} style={{borderRadius:'50%'}}>
                    </img>
                  </div>
                  <div className="info">
                    <div className="customer-name">{user.name}</div>
                    <div className="customer-phone"></div>
                  </div>
              </div>
              <ul className="left-sidebar__list tabbed-nav">
                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <button className="nav-link active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">Profile</button>
                  <button className="nav-link" id="v-pills-password-tab" data-bs-toggle="pill" data-bs-target="#v-pills-password" type="button" role="tab" aria-controls="v-pills-password" aria-selected="false">ChangePassword</button>
                  <button className="nav-link" id="v-pills-orders-tab" data-bs-toggle="pill" data-bs-target="#v-pills-orders" type="button" role="tab" aria-controls="v-pills-orders" aria-selected="false">Orders</button>
                  <button className="nav-link" id="v-pills-settings-tab"  type="button" role="tab" onClick={logoutUser}>Logout</button>
                </div>
              </ul>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-9 colright" id='account-row'>
            <div className="tab-content" id="v-pills-tabContent">
              <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                <UpdateProfile></UpdateProfile>
              </div>
              <div className="tab-pane fade" id="v-pills-password" role="tabpanel" aria-labelledby="v-pills-password-tab"><UpdatePassword></UpdatePassword></div>

              <div className="tab-pane fade" id="v-pills-orders" role="tabpanel" aria-labelledby="v-pills-orders-tab"><MyOrders></MyOrders></div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile