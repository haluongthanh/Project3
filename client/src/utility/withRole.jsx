import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../redux/features/authSlice';
import jwtDecode from 'jwt-decode';

const withRole = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const { accessToken } = useSelector(selectLoggedInUser);
    const user = accessToken ? jwtDecode(accessToken) : {};
    const role = user.UserInfo?.roles[0]?.toString();

    if (!accessToken || !allowedRoles.includes(role)) {
      return <a to='/unauthorized' />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRole;
