import React, { useEffect } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReactImageMagnify from 'react-image-magnify';
import { selectAllBanner ,fetchBannerData} from '../../redux/features/bannerSlice';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import "./type.css";
import noImg from "../../images/gallery.png"
import {toast} from 'react-toastify';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';

const BannersSlide = ({ images }) => {
  const dispatch = useDispatch();

  const { loading, banners } = useSelector(selectAllBanner);
  const hasMatchingBanner = banners && banners.some(banner => banner.Status === "slide");

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    }
  }
  useEffect(() => {
    dispatch(fetchBannerData({toast})); 
  }, [dispatch]);

if(banners==undefined)return <BoxShadowLoader/>
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      pagination={pagination}
      mousewheel={true}
      keyboard={true}
      autoplay={{ delay: 4500, disableOnInteraction: true }}
      loop={true}
      modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
      className="mySwiper"
    >
      {banners && banners.map((banner, index) => (
        (banner.Status === "slide" ?
          <SwiperSlide key={index}>
            <a href={banner.LinkURL}>
              <img src={IMAGE_BASEURL + (banner?.ImageURL?.url || '')} alt="" className="custom-image" />
            </a>
          </SwiperSlide> : null
        )
      ))}

      {!hasMatchingBanner && (
        <SwiperSlide>
          <a href="">
            <img src={noImg} alt="No Slide Image" className="custom-image" />
          </a>
        </SwiperSlide>
      )}
    </Swiper>
  )
}

export default BannersSlide;
