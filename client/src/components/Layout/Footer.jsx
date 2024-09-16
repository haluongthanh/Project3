import React, { useEffect } from 'react';
import './Footer.css';
import { URL } from '../../constants/baseURL';

const Footer = ({website}) => {
  return (
    <div class="main-footer">
      <div className='container-fluid'>
        <footer class="footer-distributed">

          <div class="footer-left">

            <h3>Company<span>logo</span></h3>

            <p class="footer-links">
              <a href="#" class="link-1">Trang Chủ</a>

              <a href={`${URL}/collection/all`}>Sản Phẩm</a>

              <a href={`${URL}/blogs/all`}>Tin</a>




            </p>

            <p class="footer-company-name">Company Name © 2015</p>
          </div>

          <div class="footer-center">

            <div>
              <i class="fa fa-map-marker"></i>
              <p>{website[0].address}</p>
            </div>

            <div>
              <i class="fa fa-phone"></i>
              <p><a href={`tel:${website[0].hotline}`}> {website[0].hotline}</a></p>
            </div>

            <div>
              <i class="fa fa-envelope"></i>
              <p><a href={`mailto:${website[0].email}`}>{website[0].email}</a></p>
            </div>

          </div>

          <div class="footer-right">

            <p class="footer-company-about">
              <span>About the company</span>
              Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
            </p>

            <div class="footer-icons">

              <a href="#"><i class="fa fa-facebook"></i></a>
              <a href="#"><i class="fa fa-twitter"></i></a>
              <a href="#"><i class="fa fa-linkedin"></i></a>
              <a href="#"><i class="fa fa-github"></i></a>

            </div>

          </div>

        </footer>
      </div>
    </div>


  );
};

export default Footer;
