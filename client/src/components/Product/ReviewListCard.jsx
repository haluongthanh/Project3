import React from 'react';
import {Box,Stack, Rating, Typography,Avatar } from '@mui/material';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import './ReviewListCard.css'

const ReviewListCard = ({review}) => {
  return (
    <>
    {/* <Box sx={{m:'0 auto', mt:2, display:'flex', flexDirection:'column',alignItems:'center',padding:2,
                    border:'1px solid #dadada', width:'90%'}}>
        <Avatar style={{height:80,width:80}}>
            <img src={IMAGE_BASEURL+review.user.avatar.url} alt={review.user.name} style={{height:80,width:80}}/>
        </Avatar>
        <Typography>{review.user.name}</Typography>
        <Stack spacing={1} sx={{display:'block'}}>
                <Rating value={review.rating} 
                        precision={0.1} 
                        readOnly
                />
        </Stack>
        <Typography>{review.comment}</Typography>
    </Box> */}
    <div class="items-comment">
      <div class="items-comment-top">
        <div className='items-comment-name'>
          {review.user.name}
        </div>
        <div class="items-comment-date">
          {review.DateComent}
        </div>
      </div>
      <div class="items-comment-bottom">
        <div class="items-comment-left">
          <Stack spacing={1} sx={{display:'block'}}>
                    <Rating value={review.rating} 
                            precision={0.1} 
                            readOnly
                    />
            </Stack>
        </div>
        <div class="items-comment-right">
          <div class="items-comment-content">
            {review.comment}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ReviewListCard