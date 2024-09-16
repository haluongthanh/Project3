
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getOrderDetails, selectOrderDetails ,selectOrderMutationResult,resetMutationResult} from '../../redux/features/orderSlice';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { formatCurrency } from '../../utility/formatCurrency';
import { formatDate } from '../../utility/formatDate';

import { CancelOrder } from '../../redux/features/orderSlice';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, order, error } = useSelector(selectOrderDetails);
  const { success } = useSelector(selectOrderMutationResult);

  useEffect(() => {
      dispatch(getOrderDetails({ id, toast }));
  }, [id, dispatch])
  const cancelOrder = () => {
      dispatch(CancelOrder({ id, toast }))
  }
 
  if (loading == undefined || order == undefined) {
      return <BoxShadowLoader />
  }
  if (error) {
    navigate('/cart');
    return null;
  }
  return (
    <div className='cart-layout'>

    <div className="cart-wrapper">
        <div className='container-fluid'>
            
            <div className="cart-main">
                <section class="section-steps">
                    <div class="checkout-steplist status">
                        <div className={`checkout-step status-one is-active `} data-box="cart-buy-order-box">
                            <div class="icon">
                                <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14.5215" cy="14" r="14" fill="#E30019"></circle>
                                    <path d="M21.4353 10.9187C21.3355 10.8254 21.2167 10.7514 21.0859 10.7009C20.9551 10.6505 20.8147 10.6247 20.6731 10.625H18.5192V10.125C18.5192 9.19674 18.1221 8.3065 17.4152 7.65013C16.7084 6.99375 15.7497 6.625 14.75 6.625C13.7503 6.625 12.7916 6.99375 12.0848 7.65013C11.3779 8.3065 10.9808 9.19674 10.9808 10.125V10.625H8.82692C8.54131 10.625 8.26739 10.7304 8.06542 10.9179C7.86346 11.1054 7.75 11.3598 7.75 11.625V18.375C7.75 19.5937 8.86058 20.625 10.1731 20.625H19.3269C19.9618 20.6252 20.5715 20.3947 21.0258 19.9828C21.2543 19.7803 21.4364 19.5369 21.5608 19.2673C21.6853 18.9977 21.7497 18.7074 21.75 18.4141V11.625C21.7504 11.4938 21.7228 11.3638 21.6688 11.2426C21.6148 11.1214 21.5355 11.0113 21.4353 10.9187ZM17.3242 14.1875L14.3088 17.6875C14.2593 17.745 14.1967 17.7915 14.1256 17.824C14.0544 17.8564 13.9764 17.8738 13.8972 17.875H13.8885C13.8107 17.875 13.7338 17.8594 13.6632 17.8292C13.5925 17.7989 13.5298 17.7549 13.4792 17.7L12.1869 16.2975C12.141 16.2476 12.106 16.1898 12.0841 16.1273C12.0622 16.0649 12.0538 15.9991 12.0593 15.9336C12.0648 15.8681 12.0841 15.8043 12.1162 15.7458C12.1482 15.6873 12.1924 15.6352 12.2462 15.5925C12.2999 15.5498 12.3622 15.5174 12.4294 15.4971C12.4966 15.4767 12.5675 15.4689 12.638 15.474C12.7085 15.4791 12.7773 15.497 12.8403 15.5268C12.9033 15.5566 12.9594 15.5976 13.0054 15.6475L13.875 16.5909L16.4835 13.5625C16.5728 13.4589 16.7027 13.3925 16.8447 13.3778C16.9867 13.3632 17.1291 13.4015 17.2407 13.4844C17.3523 13.5673 17.4238 13.6879 17.4396 13.8198C17.4554 13.9516 17.4141 14.0839 17.3249 14.1875H17.3242ZM17.4423 10.625H12.0577V10.125C12.0577 9.46196 12.3413 8.82607 12.8462 8.35723C13.3512 7.88839 14.036 7.625 14.75 7.625C15.464 7.625 16.1488 7.88839 16.6537 8.35723C17.1587 8.82607 17.4423 9.46196 17.4423 10.125V10.625Z" fill="white"></path>
                                </svg>
                            </div>
                            <div class="text"><span>Giỏ hàng</span></div>
                        </div>
                        <div className={`checkout-step status-two is-active`}  data-box="cart-info-order-box">
                            <div class="icon">
                                <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14.4009" cy="14" r="13.5" stroke="#535353"></circle>
                                    <path d="M20.0009 9H8.80088C8.02878 9 7.40088 9.56062 7.40088 10.25V17.75C7.40088 18.4394 8.02878 19 8.80088 19H20.0009C20.773 19 21.4009 18.4394 21.4009 17.75V10.25C21.4009 9.56062 20.773 9 20.0009 9ZM12.1014 11.5C12.9071 11.5 13.5014 12.0306 13.5014 12.75C13.5014 13.4694 12.9071 14 12.1014 14C11.2957 14 10.7014 13.4694 10.7014 12.75C10.7014 12.0306 11.295 11.5 12.1014 11.5ZM14.7019 16.5H9.50088V16.2094C9.50088 15.3512 10.6741 14.4688 12.1014 14.4688C13.5287 14.4688 14.7019 15.3512 14.7019 16.2094V16.5ZM19.3009 15.875H16.5009V14.625H19.3009V15.875ZM19.3009 13.375H15.8009V12.125H19.3009V13.375Z" fill="#535353"></path>
                                </svg>
                            </div>
                            <div class="text"><span>Thông tin đặt hàng</span></div>
                        </div>
                        <div className={`checkout-step status-three is-active`}  data-box="cart-payment-order-box">
                            <div class="icon">
                                <svg viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14.1709" cy="14" r="13.5" stroke="#535353"></circle>
                                    <path d="M7.16553 10.6667C7.16553 10.2246 7.34987 9.80072 7.678 9.48816C8.00614 9.17559 8.45118 9 8.91523 9H19.4134C19.8775 9 20.3225 9.17559 20.6507 9.48816C20.9788 9.80072 21.1631 10.2246 21.1631 10.6667V11.5H7.16553V10.6667ZM7.16553 13.1667V17.3333C7.16553 17.7754 7.34987 18.1993 7.678 18.5118C8.00614 18.8244 8.45118 19 8.91523 19H19.4134C19.8775 19 20.3225 18.8244 20.6507 18.5118C20.9788 18.1993 21.1631 17.7754 21.1631 17.3333V13.1667H7.16553ZM9.79008 14.8333H10.6649C10.897 14.8333 11.1195 14.9211 11.2835 15.0774C11.4476 15.2337 11.5398 15.4457 11.5398 15.6667V16.5C11.5398 16.721 11.4476 16.933 11.2835 17.0893C11.1195 17.2455 10.897 17.3333 10.6649 17.3333H9.79008C9.55805 17.3333 9.33553 17.2455 9.17147 17.0893C9.0074 16.933 8.91523 16.721 8.91523 16.5V15.6667C8.91523 15.4457 9.0074 15.2337 9.17147 15.0774C9.33553 14.9211 9.55805 14.8333 9.79008 14.8333Z" fill="#535353"></path>
                                </svg>
                            </div>
                            <div class="text"><span>Thanh toán</span></div>
                        </div>
                        <div className={`checkout-step status-four is-active`} >
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
                <div class="container-fluid">
                        <div className='row'>
                            <div class="right-main">
                                <div class="right-main-box">
                                    <div class="box-heading">
                                        <div class="line-title">
                                            <h2>Đơn hàng #{order.orderCode} - <span class="order-status">{order.orderStatus}</span></h2>
                                            <a href="/account#orders-history">Quản lý đơn hàng</a>
                                        </div>


                                        {order.orderStatus == "Cancel" ? <div id="order_cancelled" class="flash notice">
                                            <p id="order_cancelled_title" class="">Đơn hàng bị hủy vào: {formatDate(order.CancelAt)}</p>
                                        </div> : <div id="order_cancelled" class="flash notice">
                                            <p id="order_cancelled_title" class="">Đơn hàng đặt lúc: {formatDate(order.createdAt)}</p>
                                        </div>}

                                    </div>
                                    <div class="box-info-account">
                                        
                                        <div id="order_info" class="order-info">

                                            <div class="info-box" id="order_customer">
                                                <div class="info-box--title">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M0 19.9757V6.02194C0 4.90868 0.766 4 1.7 4H22.3C23.236 4 24 4.91106 24 6.02194V19.9781C24 21.0913 23.234 22 22.3 22H1.7C0.766 22 0 21.0889 0 19.9757Z" fill="#F25700"></path>
                                                        <path d="M8.64446 19H2.35554C2.1593 19 2 18.8279 2 18.616V9.38404C2 9.17207 2.1593 9 2.35554 9H8.64446C8.8407 9 9 9.17207 9 9.38404V18.6185C9 18.8279 8.8407 19 8.64446 19Z" fill="white"></path>
                                                        <path d="M9 18.7331V19H2V18.7331C2 17.6859 3.36421 17.1792 4.87716 17.0729V17.0006C4.24037 16.8128 3.67098 16.3469 3.38977 15.5802C3.10159 15.4806 2.93659 14.5601 3.01328 14.4402C2.9575 14.0534 2.58101 11.0204 5.5 11C8.41202 11.0136 8.04017 14.0399 7.97975 14.4334C8.05412 14.5533 7.89143 15.4738 7.60325 15.5734C7.32902 16.3401 6.75963 16.8128 6.12284 17.0006V17.0662C7.64509 17.186 9 17.747 9 18.7331Z" fill="#111111"></path>
                                                        <path d="M22.3 3H1.7C0.764 3 0 4.10774 0 5.45842V7H24V5.45842C24 4.10774 23.234 3 22.3 3Z" fill="#285293"></path>
                                                        <path d="M17.6565 10.1817H12.4941C12.221 10.1817 12 9.91748 12 9.59087C12 9.26427 12.221 9 12.4941 9H17.6565C17.9296 9 18.1506 9.26427 18.1506 9.59087C18.15 9.74736 18.0978 9.89723 18.0052 10.0079C17.9127 10.1185 17.7874 10.181 17.6565 10.1817ZM19.5059 13.1212H12.4941C12.221 13.1212 12 12.8569 12 12.5303C12 12.2037 12.221 11.9394 12.4941 11.9394H19.5059C19.779 11.9394 20 12.2037 20 12.5303C19.9994 12.6868 19.9471 12.8367 19.8546 12.9473C19.7621 13.058 19.6367 13.1204 19.5059 13.1212ZM16.86 16.0606H12.4941C12.221 16.0606 12 15.7963 12 15.4697C12 15.1431 12.221 14.8788 12.4941 14.8788H16.86C17.1332 14.8788 17.3542 15.1431 17.3542 15.4697C17.3536 15.6262 17.3013 15.7761 17.2088 15.8867C17.1163 15.9974 16.9909 16.0599 16.86 16.0606ZM15.6716 19H12.4941C12.221 19 12 18.7357 12 18.4091C12 18.0825 12.221 17.8183 12.4941 17.8183H15.6716C15.9447 17.8183 16.1658 18.0825 16.1658 18.4091C16.1658 18.7357 15.9447 19 15.6716 19Z" fill="white"></path>
                                                        <path d="M24 11.0063C23.9653 11.0042 23.9307 11 23.894 11C22.295 11 21 12.3425 21 14C21 15.6575 22.295 17 23.894 17C23.9286 17 23.9633 16.9958 24 16.9937V11.0063Z" fill="#285293"></path>
                                                    </svg>
                                                    <h3>Thông tin khách hàng</h3>
                                                </div>
                                                <div class="info-box--body">
                                                    <div class="name-receive"><span>Người nhận:</span> <span>{order?.shippingInfo?.name}- {order?.shippingInfo?.phone}</span></div>
                                                    <div class="address-receive"><span>Địa chỉ nhận hàng:</span> <span>{order && `${order?.shippingInfo?.province},${order?.shippingInfo?.district},${order?.shippingInfo?.ward},,${order?.shippingInfo?.address}`}</span></div>
                                                    <div class="date-receive"><span>Thời gian nhận hàng:</span> <span> </span></div>
                                                </div>
                                            </div>

                                            <div class="info-box" id="order_payment">
                                                <div class="info-box--title">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M21.5128 13.0065H12.0713C11.5653 12.9623 11.0644 13.1458 10.6769 13.5172C10.2894 13.8887 10.0465 14.4182 10.0008 14.9913L10 14.9993C10.0464 15.5798 10.2942 16.1158 10.6889 16.4893C11.0836 16.8628 11.593 17.0433 12.105 16.9912L12.0979 16.9921H21.5128C21.572 16.9983 21.6318 16.991 21.6886 16.9707C21.7453 16.9504 21.7979 16.9174 21.8433 16.8738C21.8887 16.8301 21.9259 16.7766 21.9528 16.7164C21.9797 16.6562 21.9958 16.5905 22 16.5232V13.4771C21.9846 13.3469 21.9281 13.2275 21.841 13.1409C21.7538 13.0544 21.642 13.0066 21.5261 13.0065H21.512H21.5128ZM12.0713 16.243C11.8494 16.243 11.6325 16.1684 11.448 16.0286C11.2634 15.8888 11.1196 15.6901 11.0347 15.4576C10.9498 15.2252 10.9276 14.9694 10.9709 14.7226C11.0142 14.4758 11.121 14.2491 11.2779 14.0712C11.4348 13.8933 11.6348 13.7721 11.8524 13.7231C12.07 13.674 12.2956 13.6992 12.5006 13.7955C12.7056 13.8917 12.8808 14.0548 13.0041 14.264C13.1274 14.4732 13.1932 14.7192 13.1932 14.9708V14.9744C13.1932 15.6754 12.6919 16.243 12.0744 16.243H12.0713Z" fill="#111111"></path>
                                                        <path d="M5 7V2H17V7H15.8641V4.86453C15.7431 4.89233 15.6169 4.9085 15.4854 4.91302C15.0846 4.91179 14.7006 4.75787 14.4173 4.48489C14.1339 4.21192 13.9743 3.84206 13.9732 3.45612V3.453C13.9774 3.33144 13.9942 3.2106 14.0235 3.09229H7.94957C7.98048 3.21135 7.9974 3.33339 8 3.45612C7.99872 3.84206 7.83888 4.21183 7.55539 4.48466C7.27191 4.7575 6.88782 4.91121 6.48703 4.91224H6.48378C6.35081 4.90756 6.22108 4.89038 6.10919 4.86384V7H5Z" fill="#039800"></path>
                                                        <path d="M11.3105 12.8973H21V9.97327C20.9585 9.53951 20.7467 9.13926 20.4101 8.85878C20.0735 8.5783 19.6391 8.44006 19.2006 8.47385H19.2062H3.81729C3.80419 8.45968 3.78627 8.45081 3.76697 8.44892C3.66027 8.39926 3.56893 8.32223 3.50243 8.22582C3.43592 8.1294 3.39667 8.01712 3.38874 7.90061V7.899C3.40166 7.75439 3.45888 7.61715 3.55273 7.50564C3.64659 7.39414 3.77259 7.31371 3.91388 7.27511L3.91875 7.27431V6C2.85792 6.04985 2 7.54927 2 9.42415V20.4966C2.04187 20.9298 2.25365 21.3295 2.58982 21.6097C2.92599 21.8899 3.35972 22.0283 3.79781 21.9952H3.79213H19.1811C19.6173 22.0271 20.0488 21.8888 20.3835 21.6098C20.7182 21.3309 20.9295 20.9334 20.9724 20.5022L20.9732 20.4958V17.5717H11.3373C9.77321 17.5717 8.51109 16.5217 8.51109 15.2474C8.51109 13.9481 9.7724 12.8981 11.3113 12.8981L11.3105 12.8973Z" fill="#F25700"></path>
                                                        <path d="M19 7H17V6L17.0161 6.00134C17.4686 6.0506 17.8906 6.16898 18.2391 6.34441C18.5876 6.51985 18.8502 6.74606 19 7Z" fill="#F25700"></path>
                                                    </svg>
                                                    <h3>Hình thức thanh toán</h3>
                                                </div>
                                                
                                                <div class="info-box--body">
                                                    <div class="paymentStatus">Phương thức :<span>{order.paymentMethods}</span></div>
                                                </div>
                                                <div class="info-box--body">
                                                    <div class="paymentStatus">trạng thái :<span>{order.paymentStatus}</span></div>
                                                </div>
                                                {order.paymentMethods == "Vnpay" ?
                                                    <div class="info-box--body">
                                                        <div class="paymentStatus">mã giao dịch :<span>{order.txnRef}</span></div>
                                                    </div> : null}

                                            </div>
                                        </div>
                                        <div id="order_details" class="wrap_order">
                                            <div class="info-box">
                                                <div class="info-box--title">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="8" y="6" width="7" height="12" fill="white"></rect>
                                                        <path d="M5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.89 3.89 3 5 3ZM11 9H13V7H11V9ZM14 17V15H13V11H10V13H11V15H10V17H14Z" fill="#F25700"></path>
                                                    </svg>
                                                    <h3>Thông tin sản phẩm</h3>
                                                </div>
                                                <div class="info-box--body">
                                                    {order.orderItems && order.orderItems.map((item, i) => (
                                                        <div class="table-order">
                                                            <div class="order-group single">
                                                                <div id="1805774830" data-vrid="1106689042" data-prid="1047269702" class="line-item">
                                                                    <div class="left"><div class="image">
                                                                        <img src={IMAGE_BASEURL + item.product.images[0].url} alt={item.product.title} />                                                        </div><div class="info">
                                                                            <div class="name">{item.product.title}</div>
                                                                            <div class="meta">
                                                                                <span class="variant">{item.product.title}</span>
                                                                                <span class="quantity">Số lượng: {item.quantity}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="right">
                                                                        <div class="total money text-right">
                                                                            <div class="total-price">{formatCurrency(item.price)}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div class="total-order offset-lg-6" id="order_details_total">
                                                <div class="line subtotal-price">
                                                    <div class="line--l"><span>Giá tạm tính:</span></div>
                                                    <div class="line--r"><span>{formatCurrency(order && order.itemsPrice)}</span></div>
                                                </div>

                                                <div class="line shipping-fee">
                                                    <div class="line--l"><span>Phí vận chuyển:</span></div>
                                                    <div class="line--r"><span>{formatCurrency(order.shippingPrice)}</span></div>
                                                </div>



                                                <div class="line maintotal-price">
                                                    <div class="line--l"><span>Tổng tiền:</span></div>
                                                    <div class="line--r"><span>{formatCurrency(order && order.totalPrice)}</span></div>
                                                </div>
                                                <div class="line amount-paid">
                                                    <div class="line--l">
                                                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="16" height="16" rx="8" fill="#24B400"></rect>
                                                            <path d="M5 7.86842L7.4 10.5L11 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                        </svg>
                                                        <span>Số tiền đã thanh toán:</span>
                                                    </div>
                                                    {order.paymentStatus == 'unpaid' ? (
                                                        <div class="line--r"><span><b>0₫</b></span></div>

                                                    ) : (
                                                        <div class="line--r"><span><b>{formatCurrency(order.totalPrice)}</b></span></div>

                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="action-order">
                                        {
                                            order.orderStatus == "Processing" ?
                                                <div class="summary-action">
                                                    <button type="button" id="cancel" class="btn-cancel button" name="cancel" value=" " onClick={cancelOrder}>Hủy Đơn Hàng</button>
                                                    <div class="summary-action--notify"></div>
                                                </div> :
                                                null
                                        }
                                            <a href="/cart" class="btn-back">  Quay lại Giỏ Hàng</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>
        </div>
    </div>
</div>
  )
}

export default OrderSuccess