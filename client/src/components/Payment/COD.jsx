import React,{useEffect,useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import axiosPrivate from '../../redux/axiosPrivate';
import {useNavigate} from 'react-router-dom';


import {Box, Card, Avatar, Typography, Grid, Divider} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PaymentIcon from '@mui/icons-material/Payment';

import {selectCartItems} from '../../redux/features/cartSlice';
import {selectShippingInfo} from '../../redux/features/shippingSlice';
import {selectLoggedInUser} from '../../redux/features/authSlice';
import jwtDecode from 'jwt-decode';
import {selectOrderMutationResult,createOrder,resetMutationResult} from '../../redux/features/orderSlice';
import {formatCurrency} from '../../utility/formatCurrency';


const COD = (props) => {
    const navigate=useNavigate();
    const dispatch=useDispatch()
  
    const [proccessing,setProcessing]=useState(false);
    const orderInfo=JSON.parse(sessionStorage.getItem('orderInfo'));
    const {shipInfo}=useSelector(selectShippingInfo);
    const {products}=useSelector(selectCartItems);
    const {user, accessToken}=useSelector(selectLoggedInUser);
    const {UserInfo}=jwtDecode(accessToken);
    const userEmail=UserInfo.email.toString();
    const {success}=useSelector(selectOrderMutationResult);
    const paymentData={
        amount:Math.round(orderInfo.totalPrice*100)
    }

    const orderItems=products.map(({_id,...rest})=>({...rest,product:_id}));

    const order={
        shippingInfo:shipInfo,
        orderItems:orderItems,
        itemsPrice:orderInfo.subTotal,
        taxPrice:orderInfo.tax,
        shippingPrice:orderInfo.shippingCharge,
        totalPrice:orderInfo.totalPrice

    }

    const submitHandler= async(e)=>{
        e.preventDefault();
       dispatch(createOrder({order,toast}));
    }
    useEffect(() => {
      if(success){
        dispatch(resetMutationResult());
        setProcessing(false);
        navigate('/order/success');
      }
    }, [dispatch,success,navigate]);
    
  return (
    <Box component='form'
            onSubmit={(e)=>submitHandler(e)}
            sx={{m:'0 auto', maxWidth:'550px',textAlign:'center',minWidth:'500px'}}>
       
        
        
        <LoadingButton type='submit'
                        loading={proccessing}
                        fullWidth
                        loadingPosition='start'
                        startIcon={<PaymentIcon/>}
                        variant='contained'>
                            Pay - {orderInfo && formatCurrency(orderInfo.totalPrice)}

        </LoadingButton>
        
    </Box>
  )
}

export default COD