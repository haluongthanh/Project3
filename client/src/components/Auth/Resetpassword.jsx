import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/features/authSlice';
import { toast } from 'react-toastify';
import './auth.css'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BASEURL } from '../../constants/baseURL';
const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const [access, setAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [password,setPassword]=useState('');
    const [passwordConfirm,setPasswordConfirm]=useState('');
    const [refreshPassword,setRefreshPassword]=useState('');
    const location = useLocation();
    let path = '/';
    if (location.state) {
        path = location.state.path;
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if (password!==passwordConfirm) {
            toast.warn('Mật khẩu mới và xác nhận không khớp');
          return false;
        }
        const jsonData={
            password,refreshPassword
        }
        dispatch(resetPassword({jsonData,toast}))
    }

    useEffect(() => {
        const extractedToken = token.split('&')[0];
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/v1/resetPassword?refreshPassword=${extractedToken}`);
                if (response.data.success===true) {
                    setRefreshPassword(extractedToken)
                    setAccess(true);
                } else {
                    setAccess(false);
                }
            } catch (error) {
                setAccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (!loading && !access) {
            navigate(path);
        }
    }, [loading, access, navigate, path]);
    return (
        <>
            <div class="layout-account">
                <div class="container">
                    <div class="wrapbox-content-account ">
                        <div id="login" class="userbox">
                            <div class="accounttype">
                                <h1>Phục hồi mật khẩu</h1>
                            </div>
                            <div class="accountform">
                                <form action="" onSubmit={handleSubmit}>
                                    <div class="clearfix large_form">
                                        <label for="customer_password" class="icon-field">Mật Khẩu Mới</label>
                                        <input required="" type="password" name="customer[password]" id="customer_password" onChange={e=>setPassword(e.target.value)} />
                                        <span class="toggle-password"></span>
                                    </div>
                                    <div class="clearfix large_form">
                                        <label for="customer_password_confirm" class="icon-field">Xác Nhận Mật Khẩu</label>
                                        <input type="password" required="" name="customer[password_confirmation]" id="customer_password_confirm" onChange={e=>setPasswordConfirm(e.target.value)} />
                                        <span class="toggle-password"></span>
                                    </div>
                                    <div class="clearfix large_form action-customer">
                                        <input class="btn-save button" type="submit" value="Lưu" />
                                    </div>
                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default ResetPassword;


