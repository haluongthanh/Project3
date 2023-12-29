import React, { useEffect } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReactImageMagnify from 'react-image-magnify';
import {selectAllBanner,fetchBannerData } from '../../redux/features/bannerSlice';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import "./type.css"
import noImg from "../../images/gallery.png"
import {toast} from 'react-toastify';

const BannersBottom = ({images}) => {
  const dispatch = useDispatch();

  const { loading, banners } = useSelector(selectAllBanner);
  const maxBannersToShow = 2;
  let bannersToShow = 0;
  useEffect(() => {
    dispatch(fetchBannerData({toast})); 
  }, [dispatch]);
  return (
    <div className="index-banner--list">
      {banners && banners.map((banner, index) => {
        if (bannersToShow < maxBannersToShow && banner.bannerStatus === "bottom") {
          bannersToShow++;

          return (
            <div className="index-banner--item fade-box" key={index}>
              <a className="aspect-ratio" style={{ '--height-img': 250, '--width-img': 500 }} href={banner.LinkURL}>
                <img src={IMAGE_BASEURL + banner?.ImageURL?.url} alt="" />
              </a>
            </div>
          );
        }

        return null;
      })}

      {(bannersToShow === 0 || bannersToShow === 1 ) && (
        <>
          {bannersToShow === 0 && (
            <>
              <div className="index-banner--item fade-box">
                <a className="aspect-ratio" style={{ '--height-img': 250, '--width-img': 500 }}>
                  <img src={noImg} alt="" />
                </a>
              </div>
              <div className="index-banner--item fade-box">
                <a className="aspect-ratio" style={{ '--height-img': 250, '--width-img': 500 }}>
                  <img src={noImg} alt="" />
                </a>
              </div>
             
            </>
          )}
          {bannersToShow === 1 && (
            <>
              <div className="index-banner--item fade-box">
                <a className="aspect-ratio" style={{ '--height-img': 250, '--width-img': 500 }}>
                  <img src={noImg} alt="" />
                </a>
              </div>
              
            </>
          )}
          
        </>
      )}
    </div>
  );
}

export default BannersBottom