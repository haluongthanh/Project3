import React, { useState } from 'react';
import { formatCurrency } from '../../utility/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { selectLoggedInUser } from '../../redux/features/authSlice'; // Import the authentication selector

import { addItemsToCart, selectCartItems, removeItem } from '../../redux/features/cartSlice';
import './Cart.css';
import CartItemCard from './CartItemCard';
import Shipping from '../Shipping/Shipping';
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder';
const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, accessToken } = useSelector(selectLoggedInUser);

    const { products } = useSelector(selectCartItems);
    const [currentStep, setCurrentStep] = useState(1);

    const [loginAlert, setLoginAlert] = useState(false);

    const deleteCartItems = (_id) => {
        dispatch(removeItem(_id));
    }
    const decreaseQuantity = (_id, qty) => {
        const quantity = qty - 1;
        if (qty <= 1) return;
        dispatch(addItemsToCart({ _id, quantity }));
    }
    const increaseQuantity = (_id, qty, stock) => {
        const quantity = qty + 1;
        if (stock <= qty) return;
        dispatch(addItemsToCart({ _id, quantity }));
    }
    const handleQuantityChange = (_id, e, stock) => {
        const quantity = parseInt(e.target.value);
        if (quantity > 0 && quantity <= stock) {
            dispatch(addItemsToCart({ _id, quantity }));
        }
    }
    const checkOutHandler = () => {
        if (user) {
            setCurrentStep(2);
        } else {
            setLoginAlert(true);
            setTimeout(() => {
                setLoginAlert(false);
            }, 5000);
        }
    }

    const totalAmount = products.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className='cart-layout'>

            <div className="cart-wrapper">
                <div className='container-fluid'>
                    {loginAlert && (
                        <div className="login-alert">
                            Vui lòng đăng nhập để tiếp tục
                        </div>
                    )}
                    <div className="cart-main">
                        <section class="section-steps">
                            <div class="checkout-steplist status">
                                <div className={`checkout-step status-one ${currentStep >= 1 ? 'is-active' : ''}`} onClick={() => currentStep >= 1 && handleStepChange(1)} data-box="cart-buy-order-box">
                                    <div class="icon">
                                        <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="14.5215" cy="14" r="14" fill="#E30019"></circle>
                                            <path d="M21.4353 10.9187C21.3355 10.8254 21.2167 10.7514 21.0859 10.7009C20.9551 10.6505 20.8147 10.6247 20.6731 10.625H18.5192V10.125C18.5192 9.19674 18.1221 8.3065 17.4152 7.65013C16.7084 6.99375 15.7497 6.625 14.75 6.625C13.7503 6.625 12.7916 6.99375 12.0848 7.65013C11.3779 8.3065 10.9808 9.19674 10.9808 10.125V10.625H8.82692C8.54131 10.625 8.26739 10.7304 8.06542 10.9179C7.86346 11.1054 7.75 11.3598 7.75 11.625V18.375C7.75 19.5937 8.86058 20.625 10.1731 20.625H19.3269C19.9618 20.6252 20.5715 20.3947 21.0258 19.9828C21.2543 19.7803 21.4364 19.5369 21.5608 19.2673C21.6853 18.9977 21.7497 18.7074 21.75 18.4141V11.625C21.7504 11.4938 21.7228 11.3638 21.6688 11.2426C21.6148 11.1214 21.5355 11.0113 21.4353 10.9187ZM17.3242 14.1875L14.3088 17.6875C14.2593 17.745 14.1967 17.7915 14.1256 17.824C14.0544 17.8564 13.9764 17.8738 13.8972 17.875H13.8885C13.8107 17.875 13.7338 17.8594 13.6632 17.8292C13.5925 17.7989 13.5298 17.7549 13.4792 17.7L12.1869 16.2975C12.141 16.2476 12.106 16.1898 12.0841 16.1273C12.0622 16.0649 12.0538 15.9991 12.0593 15.9336C12.0648 15.8681 12.0841 15.8043 12.1162 15.7458C12.1482 15.6873 12.1924 15.6352 12.2462 15.5925C12.2999 15.5498 12.3622 15.5174 12.4294 15.4971C12.4966 15.4767 12.5675 15.4689 12.638 15.474C12.7085 15.4791 12.7773 15.497 12.8403 15.5268C12.9033 15.5566 12.9594 15.5976 13.0054 15.6475L13.875 16.5909L16.4835 13.5625C16.5728 13.4589 16.7027 13.3925 16.8447 13.3778C16.9867 13.3632 17.1291 13.4015 17.2407 13.4844C17.3523 13.5673 17.4238 13.6879 17.4396 13.8198C17.4554 13.9516 17.4141 14.0839 17.3249 14.1875H17.3242ZM17.4423 10.625H12.0577V10.125C12.0577 9.46196 12.3413 8.82607 12.8462 8.35723C13.3512 7.88839 14.036 7.625 14.75 7.625C15.464 7.625 16.1488 7.88839 16.6537 8.35723C17.1587 8.82607 17.4423 9.46196 17.4423 10.125V10.625Z" fill="white"></path>
                                        </svg>
                                    </div>
                                    <div class="text"><span>Giỏ hàng</span></div>
                                </div>
                                <div className={`checkout-step status-two ${currentStep >= 2 ? 'is-active' : ''}`} onClick={() => currentStep >= 2 && handleStepChange(2)} data-box="cart-info-order-box">
                                    <div class="icon">
                                        <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="14.4009" cy="14" r="13.5" stroke="#535353"></circle>
                                            <path d="M20.0009 9H8.80088C8.02878 9 7.40088 9.56062 7.40088 10.25V17.75C7.40088 18.4394 8.02878 19 8.80088 19H20.0009C20.773 19 21.4009 18.4394 21.4009 17.75V10.25C21.4009 9.56062 20.773 9 20.0009 9ZM12.1014 11.5C12.9071 11.5 13.5014 12.0306 13.5014 12.75C13.5014 13.4694 12.9071 14 12.1014 14C11.2957 14 10.7014 13.4694 10.7014 12.75C10.7014 12.0306 11.295 11.5 12.1014 11.5ZM14.7019 16.5H9.50088V16.2094C9.50088 15.3512 10.6741 14.4688 12.1014 14.4688C13.5287 14.4688 14.7019 15.3512 14.7019 16.2094V16.5ZM19.3009 15.875H16.5009V14.625H19.3009V15.875ZM19.3009 13.375H15.8009V12.125H19.3009V13.375Z" fill="#535353"></path>
                                        </svg>
                                    </div>
                                    <div class="text"><span>Thông tin đặt hàng</span></div>
                                </div>
                                <div className={`checkout-step status-three ${currentStep >= 3 ? 'is-active' : ''}`} onClick={() => currentStep >= 3 && handleStepChange(3)} data-box="cart-payment-order-box">
                                    <div class="icon">
                                        <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="14.1709" cy="14" r="13.5" stroke="#535353"></circle>
                                            <path d="M7.16553 10.6667C7.16553 10.2246 7.34987 9.80072 7.678 9.48816C8.00614 9.17559 8.45118 9 8.91523 9H19.4134C19.8775 9 20.3225 9.17559 20.6507 9.48816C20.9788 9.80072 21.1631 10.2246 21.1631 10.6667V11.5H7.16553V10.6667ZM7.16553 13.1667V17.3333C7.16553 17.7754 7.34987 18.1993 7.678 18.5118C8.00614 18.8244 8.45118 19 8.91523 19H19.4134C19.8775 19 20.3225 18.8244 20.6507 18.5118C20.9788 18.1993 21.1631 17.7754 21.1631 17.3333V13.1667H7.16553ZM9.79008 14.8333H10.6649C10.897 14.8333 11.1195 14.9211 11.2835 15.0774C11.4476 15.2337 11.5398 15.4457 11.5398 15.6667V16.5C11.5398 16.721 11.4476 16.933 11.2835 17.0893C11.1195 17.2455 10.897 17.3333 10.6649 17.3333H9.79008C9.55805 17.3333 9.33553 17.2455 9.17147 17.0893C9.0074 16.933 8.91523 16.721 8.91523 16.5V15.6667C8.91523 15.4457 9.0074 15.2337 9.17147 15.0774C9.33553 14.9211 9.55805 14.8333 9.79008 14.8333Z" fill="#535353"></path>
                                        </svg>
                                    </div>
                                    <div class="text"><span>Thanh toán</span></div>
                                </div>
                                <div className={`checkout-step status-four ${currentStep >= 4 ? 'is-active' : ''}`} onClick={() => currentStep >= 4 && handleStepChange(4)}>
                                    <div class="icon">
                                        <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="14.4321" cy="14" r="13.5" stroke="#535353"></circle>
                                            <path d="M13.0988 17.1818L10.4321 14.6364L11.3721 13.7391L13.0988 15.3809L17.4921 11.1873L18.4321 12.0909M14.4321 7L8.43213 9.54545V13.3636C8.43213 16.8955 10.9921 20.1982 14.4321 21C17.8721 20.1982 20.4321 16.8955 20.4321 13.3636V9.54545L14.4321 7Z" fill="#535353"></path>
                                        </svg>
                                    </div>
                                    <div class="text"><span>Hoàn tất</span></div>
                                </div>
                            </div>
                        </section>
                        <div className={`cart-infos ${currentStep === 1 ? '' : 'd-none'}`} id="cart-buy-order-box">
                            {products.length > 0 ?
                                <>
                                    <section className="section-order">
                                        <div className="cart-order">
                                            <div className="list-pageform-cart">
                                                <div className="table-cart">
                                                    <div className="cart-group single">
                                                        {products.map((item) => (
                                                            <div key={item._id} className='item line-item line-item-container'>
                                                                <div className="left">
                                                                    <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                                                                </div>
                                                                <div className="right">
                                                                    <div className="item-info">
                                                                        <a href={`product/${item._id}`}>
                                                                            <h3>{item.title}</h3>
                                                                        </a>
                                                                    </div>
                                                                    <div className="item-meta">
                                                                        <div className="item-price">
                                                                            <span>{formatCurrency(item.quantity * item.price)}</span>
                                                                        </div>
                                                                        <div className="item-quan">
                                                                            <div className="qty quantity-partent qty-click">
                                                                                <button type="button" onClick={() => decreaseQuantity(item._id, item.quantity)} className="qtyminus qty-btn disabled" disabled=""><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3332 8H7.99984H2.6665" stroke="#cfcfcf" strokeWidth="2" strokeLinecap="round"></path></svg></button>
                                                                                <input
                                                                                    type="number"
                                                                                    value={item.quantity}
                                                                                    onChange={(e) => handleQuantityChange(item._id, e, item.stock)}
                                                                                    className="qty-input"
                                                                                    min="1"
                                                                                    max={item.stock}
                                                                                />
                                                                                <button type="button" onClick={() => increaseQuantity(item._id, item.quantity, item.stock)} className="qtyplus qty-btn"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.00033 13.3334V8.00008M8.00033 8.00008V2.66675M8.00033 8.00008H13.3337M8.00033 8.00008H2.66699" stroke="#111111" strokeWidth="2" strokeLinecap="round"></path></svg></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                    <section className="section-info-total">
                                        <div className="summary-discount d-none"></div>
                                        <div className="summary-total">
                                            <span className="title">Tổng tiền:</span>
                                            <span className="totalprice">{formatCurrency(totalAmount)}</span>
                                        </div>
                                        <div className="summary-action">
                                            <button className="btn-checkout button js-btn-checkout" data-box="cart-info-order-box" onClick={checkOutHandler}>ĐẶT HÀNG NGAY</button>
                                        </div>
                                    </section>
                                </>
                                :
                                <>
                                    <section className="section-order">
                                        <div className="cart-order">
                                            <div className="layout-cart text-center">
                                                <div className="expanded-message">
                                                    Giỏ hàng của bạn đang trống
                                                    <p className="link-continue">
                                                        <Link to="/" className="button">
                                                            <i className="fa fa-reply"></i>
                                                            Tiếp tục mua hàng
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </>
                            }
                        </div>
                        <div className={`cart-infos ${currentStep === 2 ? '' : 'd-none'}`} id="cart-info-order-box">
                            <Shipping currentStep={currentStep} setCurrentStep={setCurrentStep} />
                        </div>
                        <div className={`cart-infos ${currentStep === 3 ? '' : 'd-none'}`} id="cart-info-order-box">
                            <ConfirmOrder currentStep={currentStep} setCurrentStep={setCurrentStep} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
