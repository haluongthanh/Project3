import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, selectLoggedInUser, persistLogin } from '../../redux/features/authSlice';
import { Box, Avatar, Typography, TextField, Button, Grid, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { BASEURL } from '../../constants/baseURL';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonData = { email, password };
        dispatch(login({ jsonData, toast }));
    };

    const handleKeepMeLoggedInGoogle = () => {
        window.location.href = `${BASEURL}/api/v1/auth/google/callback`;
    };

    const handleKeepMeLoggedInFacebook = () => {
        window.location.href = `${BASEURL}/api/v1/auth/facebook/callback`;
    };

    const handleKeepMeLoggedIn = async (e) => {
        setChecked(!checked);
        dispatch(persistLogin(!checked));
    };

    useEffect(() => {
        if (accessToken) {
            navigate(path);
        }
    }, [accessToken, navigate, path]);

    return (
        <>
            <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='div' variant='h5'>Đăng Nhập</Typography>

                <Box component='form' onSubmit={handleSubmit}>
                    <TextField
                        type='email'
                        id='email'
                        label='Email'
                        name='email'
                        margin='normal'
                        required
                        fullWidth
                        autoComplete='email'
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        type='password'
                        id='password'
                        label='Mật khẩu'
                        name='password'
                        margin='normal'
                        required
                        fullWidth
                        autoComplete='current-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >Đăng Nhập</Button>

                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={checked} onChange={handleKeepMeLoggedIn} />}
                                    label='Keep me logged in.'
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item>
                            <Link to="/forgotpassword">Quên mật khẩu</Link>
                        </Grid>
                    </Grid>
                </Box>

                <Button
                    onClick={handleKeepMeLoggedInGoogle}
                    fullWidth
                    variant='contained'
                    startIcon={<GoogleIcon />}
                    sx={{ mt: 1, mb: 1 }}
                >
                    Google
                </Button>

                <Button
                    onClick={handleKeepMeLoggedInFacebook}
                    fullWidth
                    variant='contained'
                    startIcon={<FacebookIcon />}
                    sx={{ mt: 1, mb: 1 }}
                >
                    Facebook
                </Button>
            </Box>
        </>
    );
};

export default Login;
