import React from 'react';
import jwtDecode from 'jwt-decode';
import {selectLoggedInUser} from '../../../redux/features/authSlice';
import {useSelector} from 'react-redux';

import AdminDashboard from './AdminDashboard';
import ManageDashboard from './ManageDashboard';

const Dashboard = () => {
  const {accessToken}=useSelector(selectLoggedInUser);
  let role;
  const {UserInfo}=jwtDecode(accessToken);
  role=UserInfo.roles[0];
  return role==='admin'? <AdminDashboard/> : <ManageDashboard/>;
}

export default Dashboard