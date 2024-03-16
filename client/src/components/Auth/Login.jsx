import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

import { login, selectLoggedInUser, persistLogin, loginGoogle } from '../../redux/features/authSlice';
import GoogleButton from 'react-google-button';
import { Box, Avatar, Typography, TextField, Button, Grid, FormGroup, FormControlLabel, Checkbox, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { GoogleAuthProvider ,signInWithPopup,getAuth} from 'firebase/auth'
import {app} from '../../firebase';
const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let path = '/';
    if (location.state) {
        path = location.state.path;
    }
    const dispatch = useDispatch();
    const { accessToken } = useSelector(selectLoggedInUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const handleLoginGoogle = async () => {
        try {
            const Provider =new GoogleAuthProvider();
            const auth =getAuth();
            const result =await signInWithPopup(auth,Provider)
        
            const formData=new FormData();
            formData.append('email',result.user.email);
            formData.append('name',result.user.displayName);
            formData.append('authGoogleId',result.user.providerData[0].uid);
            dispatch(loginGoogle({ formData, toast }));

           
        } catch (error) {
            console.log(error)
        }

    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const jsonData = {
            email,
            password
        }
        dispatch(login({ jsonData, toast }));
    }
    const handleKeepMeLoggedIn = async (e) => {
        setChecked(!checked);
        dispatch(persistLogin(!checked));
    }
    useEffect(() => {
        if (accessToken) {
            navigate(path);
        }
    }, [accessToken, navigate, path])

    return (
        <>
            <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='div' variant='h5'>Login</Typography>

                <Box component='form' onSubmit={handleSubmit}>
                    <TextField type='email'
                        id='email'
                        label='Email'
                        name='email'
                        margin='normal'
                        required
                        fullWidth
                        autoComplete='email'
                        autoFocus
                        value={email}
                        onChange={(e => setEmail(e.target.value))}
                    />
                    <TextField type='password'
                        id='password'
                        label='Password'
                        name='password'
                        margin='normal'
                        required
                        fullWidth
                        autoFocus
                        value={password}
                        onChange={(e => setPassword(e.target.value))}
                    />
                    <Button type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >Login</Button>

                    <Grid container style={{}}>
                        <Grid item xs>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}
                                    label='Keep me logged in.'
                                    checked={checked}
                                    onChange={handleKeepMeLoggedIn}
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <button type='button' onClick={handleLoginGoogle}>login google</button>
        </>
    )
}

export default Login