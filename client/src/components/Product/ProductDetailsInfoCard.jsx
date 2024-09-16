import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';


import { Box, Typography, Stack, Rating, IconButton, Tooltip, Button } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { formatCurrency } from '../../utility/formatCurrency';

import { addItemsToCart } from '../../redux/features/cartSlice';
import './ProductDetailsInfoCard.css'

const ProductDetailsInfoCard = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = () => {
    if (1 === quantity) return;
    const qty = quantity - 1;
    setQuantity(qty);
  }
  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  }
  const addToCartHandler = () => {
    const _id = product._id;
    dispatch(addItemsToCart({ _id, quantity, toast }))
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  }
  const calculateDiscountPercentage = () => {
    return ((product.discount / product.price) * 100).toFixed(2);
  }
  return (
    <div className='info-wrapper'>
      <div class="info-header">
        <div class="info-content">
          <div class="info-top">
            <div class="product-name">
              <h1>{product.title}</h1>
            </div>
            <div class="product-rating" >
              <Stack spacing={1} className='rating-review' display='block'>
                <Rating value={product.ratings} precision={0.1} readOnly />
              </Stack>
              <Typography gutterBottom
                sx={{ display: 'block' }}
                component='span'>Đánh Giá : {product.numOfReviews}
              </Typography>
              <a href="#customers-rating" class="click-scroll js-scroll">Xem đánh giá</a>
            </div>
          </div>
          <div class="info-bottom">
            <div class="product-price ">
              <span class="pro-price a">{formatCurrency(product.price - product.discount)}</span>
              {product.discount > 0 ?
                <>
                  <del>{formatCurrency(product.price)}</del><span class="pro-percent">-{calculateDiscountPercentage()}%</span></> : ""}
            </div>
            <div className='product-actions'>
              {product.stock > 0 ?
                <div class="action-buys">
                  <button type="submit" class="button btn-buynow" name="buy-now" id="buy-now" onClick={addToCartHandler}>
                    <span class="maintext">MUA NGAY</span>
                    <span class="subtext">Giao tận nơi hoặc nhận tại cửa hàng</span>
                  </button>
                </div>
                :
                <div class="action-buys">
                  <button type="submit" class="button btn-buynow" name="buy-now" id="buy-now" >
                    <span class="maintext">MUA NGAY</span>
                    <span class="subtext">Giao tận nơi hoặc nhận tại cửa hàng</span>
                  </button>
                </div>
              }


            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductDetailsInfoCard