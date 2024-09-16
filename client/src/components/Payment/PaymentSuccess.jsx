import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../redux/features/authSlice';
import { selectShippingInfo } from '../../redux/features/shippingSlice';
import { selectCartItems } from '../../redux/features/cartSlice';
import { selectOrderMutationResult, createOrder, resetMutationResult } from '../../redux/features/orderSlice';
import jwtDecode from 'jwt-decode';
import { toast } from "react-toastify";
import axios from 'axios';
import { BASEURL } from "../../constants/baseURL";
import BoxShadowLoader from "../Skeletons/BoxShadowLoader";
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const PaymentSuccess = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState('')

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    const { shipInfo } = useSelector(selectShippingInfo);
    const { products } = useSelector(selectCartItems);
    const { accessToken } = useSelector(selectLoggedInUser);
    const { success } = useSelector(selectOrderMutationResult);
    const { UserInfo } = jwtDecode(accessToken);

    const orderItems = products.map(({ _id, ...rest }) => ({ ...rest, product: _id }));

    const vnp_Amount = query.get('vnp_Amount');
    const vnp_BankCode = query.get('vnp_BankCode');
    const vnp_BankTranNo = query.get('vnp_BankTranNo');
    const vnp_CardType = query.get('vnp_CardType');
    const vnp_OrderInfo = query.get('vnp_OrderInfo');
    const vnp_PayDate = query.get('vnp_PayDate');
    const vnp_ResponseCode = query.get('vnp_ResponseCode');
    const vnp_TmnCode = query.get('vnp_TmnCode');
    const vnp_TransactionNo = query.get('vnp_TransactionNo');
    const vnp_TransactionStatus = query.get('vnp_TransactionStatus');
    const vnp_TxnRef = query.get('vnp_TxnRef');
    const vnp_SecureHash = query.get('vnp_SecureHash');
    
    const totalPrice = orderInfo.subTotal +  orderInfo.shippingCharge+orderInfo.tax;

    const order = {
        shippingInfo: shipInfo,
        orderItems: orderItems,
        itemsPrice: orderInfo.subTotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharge,
        totalPrice: totalPrice,
        paymentMethods: "Vnpay",
        txnRef : vnp_TxnRef,
        paymentStatus:"paid"
    };

    useEffect(() => {
        const handlePaymentReturn = async () => {
            try {
                if (vnp_ResponseCode !== '00') {
                    navigate('/cart');
                    return;
                }

                if (!success) {
                    const response = await axios.get(`${BASEURL}/api/v1/checkTxnRef/${vnp_TxnRef}`);
                    if (!response.data.exists) {
                        const resultAction = await dispatch(createOrder({ order, toast }));

                        if (createOrder.fulfilled.match(resultAction)) {
                            const { order } = resultAction.payload;
                            const orderId = order._id; // lấy ID của đơn hàng

                            setOrderId(orderId)
                        } else {
                            console.error('Failed to create order:', resultAction.payload);
                        }
                    } else {
                        navigate('/cart');
                    }
                }
            } catch (error) {
                console.error('Error handling payment return', error);
            }
        };
    
        handlePaymentReturn();
    }, []); 

    useEffect(() => {
        if (success&& orderId) {
            dispatch(resetMutationResult());
            navigate(`/order/success/${orderId}`);
        }
    }, [dispatch, success, navigate,orderId]);

    return (
        <BoxShadowLoader/>
    );
};

export default PaymentSuccess;
