import React, { useEffect, useState } from 'react';
import './ConfirmOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utility/formatCurrency';
import { Box, Typography, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { selectShippingInfo } from '../../redux/features/shippingSlice';
import { selectCartItems } from '../../redux/features/cartSlice';
import { toast } from 'react-toastify';
import { selectOrderMutationResult, createOrder, resetMutationResult, Payment } from '../../redux/features/orderSlice';
const ConfirmOrder = ({ currentStep, setCurrentStep }) => {
    const dispatch = useDispatch();
    const { shipInfo } = useSelector(selectShippingInfo);
    const { products } = useSelector(selectCartItems);
    const { success } = useSelector(selectOrderMutationResult);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [orderId, setOrderId] = useState('')
    const address = `${shipInfo.province}, ${shipInfo.district}, ${shipInfo.ward},${shipInfo.address}`;
    const navigate = useNavigate();

    let subTotal = products.reduce((acc, item) => acc + item.quantity * item.price, 0);
    // let tax = shipInfo.country === 'VN' ? subTotal * 0.10 : subTotal * 0.50;
    let tax = 0;
    let unitShippingCharge = [];
    let shippingCharge = 0;

    const calculateShippingCharge = () => {
        for (let i = 0; i < products.length; i++) {
            if (shipInfo.country === 'VN') {
                if (products[i].localShipmentPolicy === 'free') {
                    unitShippingCharge[i] = 0;
                } else if (products[i].localShipmentPolicy === 'custom') {
                    unitShippingCharge[i] = products[i].quantity * products[i].customLocalShipmentCost;
                } else if (products[i].localShipmentPolicy === 'standard') {
                    unitShippingCharge[i] = products[i].weight && products[i].weight > 5
                        ? Math.ceil(products[i].weight / 5) * products[i].quantity * process.env.REACT_APP_LOCAL_CHARGE
                        : products[i].quantity * process.env.REACT_APP_LOCAL_CHARGE;
                }
            } else {
                if (products[i].internationalShipmentPolicy === 'free') {
                    unitShippingCharge[i] = 0;
                } else if (products[i].internationalShipmentPolicy === 'custom') {
                    unitShippingCharge[i] = products[i].quantity * products[i].customInternationShipmentCost;
                } else if (products[i].internationalShipmentPolicy === 'standard') {
                    unitShippingCharge[i] = products[i].weight && products[i].weight > 5
                        ? Math.ceil(products[i].weight / 5) * products[i].quantity * process.env.REACT_APP_INTER_CHARGE
                        : products[i].quantity * process.env.REACT_APP_INTER_CHARGE;
                }
            }
            shippingCharge += unitShippingCharge[i];
        }
    };

    calculateShippingCharge();
    const totalPrice = subTotal + shippingCharge + tax;

    const orderItems = products.map(({ _id, ...rest }) => ({ ...rest, product: _id }));

    const order = {
        shippingInfo: shipInfo,
        orderItems: orderItems,
        itemsPrice: subTotal,
        taxPrice: tax,
        shippingPrice: shippingCharge,
        totalPrice: totalPrice,
        txnRef: ""
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const procedToPayment = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'VNPAY') {
            handleClickVnpay();
        } else if (paymentMethod === 'COD') {
            try {
                const resultAction = await dispatch(createOrder({ order, toast }));

                if (createOrder.fulfilled.match(resultAction)) {
                    const { order } = resultAction.payload;
                    const orderId = order._id; // lấy ID của đơn hàng

                    setOrderId(orderId)
                } else {
                    console.error('Failed to create order:', resultAction.payload);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        } else {
            toast.error("Please select a payment method");
        }
    };


    const handleClickVnpay = async () => {
        const jsonData = new FormData();
        jsonData.append("amount", totalPrice);
        const data = await dispatch(Payment({ jsonData, toast }));
        const datas = {
            subTotal, shippingCharge, tax, totalPrice
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(datas));
        window.location.href = `${data.payload.redirectUrl}`;
    };
    useEffect(() => {
        if (success&& orderId) {
            dispatch(resetMutationResult());
            setProcessing(false);
            navigate(`/order/success/${orderId}`);
        }
    }, [dispatch, success, navigate,orderId]);

    return (

        <>

            <div class="cart-infos" id="cart-payment-order-box">
                <section class="section-info-order ">
                    <div class="cart-block cart-order-table no-mrg">
                        <div class="cart-title"><h2>Thông tin đặt hàng</h2></div>
                        <div class="cart-detail">
                            <div class="order-table">
                                <div class="line" id="orderinfo_member">
                                    <div class="left"><span class="name">Khách hàng:</span></div>
                                    <div class="right"><p class="value">{shipInfo.name}</p></div>
                                </div>
                                <div class="line" id="orderinfo_phone">
                                    <div class="left"><span class="name">Số điện thoại</span></div>
                                    <div class="right"><p class="value">{shipInfo.phone}</p></div>
                                </div>

                                <div class="line" id="orderinfo_adress">
                                    <div class="left"><span class="name">Địa chỉ nhận hàng</span></div>
                                    <div class="right"><p class="value">{address}</p></div>
                                </div>


                                <div class="line" id="orderinfo_totalprice">
                                    <div class="left"><span class="name">Tổng tiền</span></div>
                                    <div class="right"><p class="value"><strong>{formatCurrency(totalPrice)}</strong></p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                <section class="section-info-order-product ">
                    {products && products.map((item, i) => (
                        <Box key={item._id} sx={{ display: 'flex', width: '100%', mb: 2 }}>
                            <Box>
                                <img src={IMAGE_BASEURL + item.image} alt={item.title} style={{ maxWidth: 100, marginRight: '5px' }} />
                            </Box>
                            <Box>
                                <Typography component='div' variant='button'>
                                    <Link to={`/product/${item._id}`} >{item.title}</Link>
                                </Typography>
                                <Typography component='div' variant='button'>
                                    Price : {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                                </Typography>
                                <Typography component='div' variant='button'>
                                    Shipping charge : {formatCurrency(unitShippingCharge[i])}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </section>
                <hr />
                <section class="section-info-method">
                    <div class="cart-block cart-method-table no-mrg">
                        <div class="cart-title"><h2>Chọn hình thức thanh toán</h2></div>
                        <div class="cart-detail">
                            <div class="list-method">
                                <div class="item-method js-btn-payment  is-active">
                                    <input type="radio" name="paymentMethod" value="VNPAY" checked={paymentMethod === 'VNPAY'}
                                        onChange={() => handlePaymentMethodChange({ target: { value: 'VNPAY' } })} />
                                    <label>VNPAY</label>

                                </div>
                                <div class="item-method js-btn-payment  is-active">
                                    <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'}
                                        onChange={() => handlePaymentMethodChange({ target: { value: 'COD' } })} />
                                    <label>COD</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                <section class="section-info-total">

                    <div class="summary-discount d-none"></div>
                    <div class="summary-total"><span class="title">Tổng tiền:</span><span class="totalprice">{formatCurrency(totalPrice)}</span></div>
                    <div class="summary-action">
                        <button type="button" id="checkout" class="btn-checkout button" name="checkout" value=" " onClick={procedToPayment}>THANH TOÁN NGAY</button>
                        <div class="summary-action--notify"></div>
                    </div>
                </section>
            </div></>


    );
};

export default ConfirmOrder;
