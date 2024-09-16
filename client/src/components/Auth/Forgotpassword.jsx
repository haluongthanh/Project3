import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/features/authSlice';
import { toast } from 'react-toastify';

const Forgotpassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 

        const jsonData = {
            email
        };

        dispatch(forgotPassword({ jsonData, toast }));
    };

    return (
        <div className="layout-account">
            <div className="container">
                <div className="wrapbox-content-account">
                    <div id="login" className="userbox">
                        <div className="accounttype">
                            <h1>Quên mật khẩu</h1>
                        </div>
                        <div className="accountform">
                            <form onSubmit={handleSubmit}>
                                <div className="clearfix large_form">
                                    <label htmlFor="customer_email" className="icon-field">Email</label>
                                    <input 
                                        required 
                                        type="email" 
                                        name="customer[email]" 
                                        id="customer_email" 
                                        onChange={e => setEmail(e.target.value)} 
                                    />
                                    <span className="toggle-email"></span>
                                </div>

                                <div className="clearfix large_form action-customer">
                                    <input className="btn-save button" type="submit" value="Submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgotpassword;
