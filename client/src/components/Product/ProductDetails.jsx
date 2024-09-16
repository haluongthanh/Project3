import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { selectProductDetails, productDetails } from '../../redux/features/productSlice';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
import ProductDetailsImageCarouselCard from './ProductDetailsImageCarouselCard';
import ProductDetailsInfoCard from './ProductDetailsInfoCard';
import './ProductDetails.css';
import { newReview, selectAllReviews, selectReviewMutationResult, resetMutationResult, getReviews } from '../../redux/features/reviewSlice';
import ReviewListCard from './ReviewListCard';
import { NavLink, Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize, Stack, Rating, Typography } from '@mui/material';

import './ProductDetails.css'

const ProductDetails = () => {
    const [submitRating, setSubmitRating] = useState(5);
    const [submitReview, setSubmitReview] = useState('');
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, product } = useSelector(selectProductDetails);
    const { reviews } = useSelector(selectAllReviews);
    const { success } = useSelector(selectReviewMutationResult);

    useEffect(() => {
        if (success) {
            toast.success('Cảm ơn bạn đã đánh giá.');
            dispatch(resetMutationResult());
        }
        dispatch(productDetails({ id, toast }));
        dispatch(getReviews({ id, toast }));
    }, [dispatch, id, success]);

    if (loading == undefined || product == undefined) {
        return <BoxShadowLoader />
    }
    const handleSubmitReviewRating = () => {
        setOpen(false);

        const jsonData = {
            rating: submitRating,
            comment: submitReview,
            productId: product._id
        }
        dispatch(newReview({ jsonData, toast }));
    }
    return (
        <>
            {loading ? <BoxShadowLoader /> :
                <>
                    <div className='product-top'>
                        <div class="breadcrumb-wrap"><div class="container-fluid">
                            <div class="breadcrumb-list  ">
                                <ol class="breadcrumb breadcrumb-arrows" >
                                    <li >
                                        <a href="/" target="_self" itemprop="item">
                                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.25895 13.1594V8.95647H9.73718V13.1594C9.73718 13.6217 10.1285 14 10.6067 14H13.2154C13.6937 14 14.085 13.6217 14.085 13.1594V7.27529H15.5632C15.9632 7.27529 16.1545 6.79616 15.8502 6.54398L8.58067 0.21435C8.25024 -0.07145 7.7459 -0.07145 7.41546 0.21435L0.145957 6.54398C-0.149693 6.79616 0.0329144 7.27529 0.432911 7.27529H1.91116V13.1594C1.91116 13.6217 2.30246 14 2.78072 14H5.38939C5.86765 14 6.25895 13.6217 6.25895 13.1594Z" fill="#1982F9"></path>
                                            </svg>
                                            <span itemprop="name">Trang chủ</span>
                                        </a>
                                    </li>


                                    <li >
                                        <a href={`/collection/${product.category._id}`} target="_self" itemprop="item">
                                            <span itemprop="name">{product.category.title}</span>
                                        </a>
                                    </li>

                                    <li class="active" >
                                        <span itemprop="item" >
                                            <strong itemprop="name">{product.title}</strong>
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        </div>

                    </div>
                    <div className='product-details'>

                        <div className='container-fluid'>
                            <div className='row'>
                                <div className="p-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                    <div className="product-inner">
                                        <div className='product-main'>
                                            <div className="d-flex flex-wrap">
                                                <div className="col-lg-5 col-md-12 col-12 product-gallery">
                                                    {product?.images && <ProductDetailsImageCarouselCard images={product.images} />}
                                                </div>
                                                <div className='col-lg-7 col-md-12 col-12 product-info'>
                                                    {product && <ProductDetailsInfoCard product={product} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 col-xl-12 col-lg-7 col-md-12 col-sm-12 col-12">
                                    <div class="product-inner">
                                        <div class="product-block product-desc">
                                            <div class="product-heading">
                                                <h2>Thông tin sản phẩm</h2>
                                            </div>
                                            <div class="product-wrap">
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" >
                                    <div class="product-inner" id="customers-rating">
                                        <div class="product-heading">
                                            <h2>Đánh giá &amp; Nhận xét {product.title}</h2>
                                        </div>
                                        <div class="product-wrap">
                                            <div class="product-rating--wrapper">
                                                <div class="product-reviews--header">
                                                    <Stack spacing={1} className='rating-review' display='block'>
                                                        <Rating value={product.ratings} precision={0.1} readOnly />
                                                    </Stack>

                                                    <Typography gutterBottom
                                                        sx={{ display: 'block' }}
                                                        component='div'>({product.numOfReviews}) lượt đánh giá và nhận xét
                                                    </Typography>
                                                </div>

                                                <div class="product-reviews--body" >


                                                    <div class="product-reviews--render">
                                                        {product?.reviews && product.reviews.map(review =>
                                                            <ReviewListCard review={review} />
                                                        )}

                                                    </div>


                                                </div>
                                                <div class="product-reviews--footer">
                                                    <Button variant="outlined" onClick={handleClickOpen}>Đánh giá sản phẩm</Button>
                                                    <Dialog open={open} onClose={handleClose}>
                                                        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', mb: 2 }}>Đánh Giá &#38;  Xếp Hạng</DialogTitle>
                                                        <DialogContent sx={{ minWidth: '350px' }} fullWidth>
                                                            <Stack spacing={1} sx={{ display: 'block' }}>
                                                                <Rating value={submitRating}
                                                                    precision={0.1}
                                                                    onChange={((e, newValue) => setSubmitRating(newValue))}
                                                                />
                                                            </Stack>
                                                            <TextareaAutosize
                                                                id="review"
                                                                style={{ width: '100%', margin: '10px 0', padding: 0 }}
                                                                minRows={5}
                                                                value={submitReview}
                                                                variant="standard"
                                                                onChange={(e => setSubmitReview(e.target.value))}
                                                            />
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={handleClose}>Hủy</Button>
                                                            <Button onClick={handleSubmitReviewRating}>Gửi</Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ProductDetails