import React,{useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import {selectProductDetails,productDetails} from '../../redux/features/productSlice';
import {toast} from 'react-toastify';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
import ProductDetailsImageCarouselCard from './ProductDetailsImageCarouselCard';
import ProductDetailsInfoCard from './ProductDetailsInfoCard';
import './ProductDetails.css';
import { newReview,selectAllReviews,selectReviewMutationResult,resetMutationResult, getReviews } from '../../redux/features/reviewSlice';
import ReviewListCard from './ReviewListCard';
import {NavLink,Link} from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

import {Box,Button, Dialog, DialogActions, DialogContent, DialogTitle, TextareaAutosize,Stack, Rating, Typography } from '@mui/material';

import './ProductDetails.css'

const ProductDetails = () => {
    const [submitRating,setSubmitRating]=useState(5);
    const [submitReview,setSubmitReview]=useState('');
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const {id}=useParams();
    const dispatch=useDispatch();
    const {loading,product}=useSelector(selectProductDetails);
    const {reviews}=useSelector(selectAllReviews);
    const {success}=useSelector(selectReviewMutationResult);
    console.log(reviews);

    useEffect(() => {
        if(success){
            toast.success('Thank for your valuable review.');
            dispatch(resetMutationResult());
        }
      dispatch(productDetails({id,toast}));
      dispatch(getReviews({id,toast}));
    }, [dispatch,id,success]);
    
    const handleSubmitReviewRating=()=>{
            setOpen(false);

            const jsonData={
                rating:submitRating,
                comment:submitReview,
                productId:product._id
            }
            dispatch(newReview({jsonData,toast}));
    }
  return (
    <>
        {loading?<BoxShadowLoader/>:
            <>
            <Box className='product-top'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <NavLink to='/' className={({isActive})=>isActive?'active':''}>
                                <HomeIcon/>Home
                            </NavLink>
                        </li>
                        <li class="breadcrumb-item"><a href="#">{product.category.title}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{product.title}</li>
                    </ol>
                </nav>
            </Box>
            <Box className='product-details'>
                
                <div className='container-fluid'>
                    <div className='row'>
                        <div className="p-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="product-inner">
                                <div className='product-main'>
                                    <div className="d-flex flex-wrap">
                                        <div className="col-lg-5 col-md-12 col-12 product-gallery">
                                            {product?.images && <ProductDetailsImageCarouselCard images={product.images}/>}
                                            </div>
                                        <div className='col-lg-7 col-md-12 col-12 product-info'>
                                            {product && <ProductDetailsInfoCard product={product}/>}
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
                                        dangerouslySetInnerHTML={{__html: product.description}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div class="product-inner">
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
                                                        sx={{display:'block'}}
                                                        component='div'>({product.numOfReviews}) lượt đánh giá và nhận xét
                                            </Typography>
                                        </div>
                                    
                                        <div class="product-reviews--body">
                                            
                                           
                                                <div class="product-reviews--render">
                                                    {product?.reviews && product.reviews.map(review=>
                                                        <ReviewListCard review={review} />
                                                    )}
                                                
                                                </div>                         
                                            
                                            
                                        </div>
                                        <div class="product-reviews--footer">
                                            <Button variant="outlined" onClick={handleClickOpen}>Submit Review</Button>
                                            <Dialog open={open} onClose={handleClose}>
                                                <DialogTitle sx={{bgcolor:'primary.main', color:'#fff',mb:2}}>Review &#38; Rating</DialogTitle>
                                                <DialogContent sx={{minWidth:'350px'}} fullWidth>
                                                <Stack spacing={1} sx={{display:'block'}}>
                                                        <Rating value={submitRating} 
                                                                precision={0.1} 
                                                                onChange={((e,newValue)=>setSubmitRating(newValue))}
                                                        />
                                                </Stack>
                                                <TextareaAutosize                            
                                                    id="review"
                                                    style={{width:'100%',margin:'10px 0',padding:0}}
                                                    minRows={5}
                                                    value={submitReview}
                                                    variant="standard"
                                                    onChange={(e=>setSubmitReview(e.target.value))}
                                                />
                                                </DialogContent>
                                                <DialogActions>
                                                <Button onClick={handleClose}>Cancel</Button>
                                                <Button onClick={handleSubmitReviewRating}>Submit</Button>
                                                </DialogActions>
                                            </Dialog>   
                                        </div>
                                    </div>
                                
                                </div>
                            
                            </div>
                                    
                        </div>
                    </div>
                
                </div>
            </Box>



            {/* <Box className='product-reviews' style={{marginTop:'50px'}}>
                <Box className='reviews' style={{textAlign:'center'}}>
                    <Button variant="outlined" onClick={handleClickOpen}>Submit Review</Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle sx={{bgcolor:'primary.main', color:'#fff',mb:2}}>Review &#38; Rating</DialogTitle>
                        <DialogContent sx={{minWidth:'350px'}} fullWidth>
                        <Stack spacing={1} sx={{display:'block'}}>
                                <Rating value={submitRating} 
                                        precision={0.1} 
                                        onChange={((e,newValue)=>setSubmitRating(newValue))}
                                />
                        </Stack>
                        <TextareaAutosize                            
                            id="review"
                            style={{width:'100%',margin:'10px 0',padding:0}}
                            minRows={5}
                            value={submitReview}
                            variant="standard"
                            onChange={(e=>setSubmitReview(e.target.value))}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmitReviewRating}>Submit</Button>
                        </DialogActions>
                    </Dialog>   

                    {product?.reviews && product.reviews[0] ? 
                    <Box className='review'>
                        {product?.reviews && product.reviews.map(review=>
                            <ReviewListCard review={review} />
                        )}
                    </Box>
                        :                       
                    <Typography variant='button'>No reviews yet</Typography>                        
                    }

                </Box>                
            </Box> */}
        </>
        }
    </>
  )
}

export default ProductDetails