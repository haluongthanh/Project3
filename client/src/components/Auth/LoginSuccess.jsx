import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { toast } from 'react-toastify';
import { LoginGoogle, selectLoggedInUser, persistLogin } from '../../redux/features/authSlice';
import { useDispatch, useSelector} from 'react-redux';
import {useNavigate,useLocation} from 'react-router-dom';
import { BASEURL } from '../../constants/baseURL';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';

const LoginSuccess = () => {
    const navigate=useNavigate();

    const dispatch=useDispatch();
    const location=useLocation();
    let path='/';
    if(location.state){
        path=location.state.path;
    }
    const {accessToken}=useSelector(selectLoggedInUser);

    const [email, setEmail] = useState('');
    const [name,setName]=useState('')
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/v1/auth/login/success`, { withCredentials: true });
                if (response.data.success) {
                    console.log("data : ",response.data.user)
                    const jsonData =new FormData();
                    jsonData.append("email",response.data.user.emails[0].value)
                    jsonData.append("name",response.data.user.displayName)
                    dispatch(LoginGoogle({jsonData,toast}))
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if(accessToken){
         navigate(path) ;
        }
      }, [accessToken,navigate,path])

    return (
        <BoxShadowLoader/>
    );
};


export default LoginSuccess;
