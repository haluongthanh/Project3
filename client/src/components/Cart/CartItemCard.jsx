import React from 'react';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { formatCurrency } from '../../utility/formatCurrency';

import { Button, Box, Typography, Card, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Cart.css'
const CartItemCard = ({ item, deleteCartItems }) => {
    return (
        
        <>
            <div class="item-img">
                <a href="">
                    <img src={IMAGE_BASEURL+item.image} alt={item.title} />
                </a>

            </div>
            <div class="item-remove">
                <div class="remove">
                    <a class="cart" onClick={()=>deleteCartItems(item._id)}>
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.58036 11.75H10.1696C10.317 11.75 10.4643 11.6328 10.4643 11.4688V6.40625C10.4643 6.26563 10.317 6.125 10.1696 6.125H9.58036C9.40848 6.125 9.28571 6.26563 9.28571 6.40625V11.4688C9.28571 11.6328 9.40848 11.75 9.58036 11.75ZM13.6071 3.875H11.5692L10.7344 2.5625C10.5379 2.23438 10.1451 2 9.72768 2H7.24777C6.83036 2 6.4375 2.23438 6.24107 2.5625L5.40625 3.875H3.39286C3.17188 3.875 3 4.0625 3 4.25V4.625C3 4.83594 3.17188 5 3.39286 5H3.78571V12.875C3.78571 13.5078 4.30134 14 4.96429 14H12.0357C12.6741 14 13.2143 13.5078 13.2143 12.875V5H13.6071C13.8036 5 14 4.83594 14 4.625V4.25C14 4.0625 13.8036 3.875 13.6071 3.875ZM7.19866 3.19531C7.22321 3.17188 7.27232 3.125 7.32143 3.125C7.32143 3.125 7.32143 3.125 7.34598 3.125H9.65402C9.70313 3.125 9.75223 3.17188 9.77679 3.19531L10.1942 3.875H6.78125L7.19866 3.19531ZM12.0357 12.875H4.96429V5H12.0357V12.875ZM6.83036 11.75H7.41964C7.56696 11.75 7.71429 11.6328 7.71429 11.4688V6.40625C7.71429 6.26563 7.56696 6.125 7.41964 6.125H6.83036C6.65848 6.125 6.53571 6.26563 6.53571 6.40625V11.4688C6.53571 11.6328 6.65848 11.75 6.83036 11.75Z" fill="#6D6E72"></path></svg>
                    Xóa
                    </a>
                </div>
            </div>
        </>
    )
}

export default CartItemCard