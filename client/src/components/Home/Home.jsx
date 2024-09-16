import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axiosPublic } from '../../redux/axiosPublic';
import ProductCard from '../Product/ProductCard';
import { getCategories, selectAllCategories } from '../../redux/features/categorySlice';
import './layout.css'
import { Box, Typography } from '@mui/material';
import { Link, NavLink } from "react-router-dom";
import { IMAGE_BASEURL, URL } from '../../constants/baseURL';
import BannersSlide from '../Banners/BannersSlide';
import BannersBottom from '../Banners/BannersBottom';
import BannersRight from '../Banners/BannersRight';
import Slider from "react-slick";
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
const Home = () => {
    const limit = 8;
    const dispatch = useDispatch();
    const { categories } = useSelector(selectAllCategories);

    useEffect(() => {
        dispatch(getCategories({ toast }));
    }, [dispatch]);

    const [topRatedProduct, setTopRatedProduct] = useState();
    

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await axiosPublic.get(`/products?&limit=${limit}&sort_by_ratings=${true}`)
                setTopRatedProduct(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getProducts();
    }, [])

    const [categoryProducts, setCategoryProducts] = useState([]);
    const [catProductsLoading, setCatProductsLoading] = useState(false);

    useEffect(() => {
        if (categories) {
            setCatProductsLoading(true);
            const getProducts = async () => {
                try {
                    const response = categories.map(async (category) =>
                        await axiosPublic.get(`/products?&limit=${limit}&category=${category._id}`))
                    Promise.all(response).then((values) => {
                        setCategoryProducts([...categoryProducts, ...values.map(value => value.data)])
                    })
                } catch (error) {
                    console.log(error);
                    setCatProductsLoading(false);
                } finally {
                    setCatProductsLoading(false);
                }
            }
            getProducts();
        }
    }, [categories, catProductsLoading]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: <button className="slick-prev"><i className="fas fa-chevron-left"></i></button>,
        nextArrow: <button className="slick-next"><i className="fas fa-chevron-right"></i></button>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 220,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    if (categories == undefined) return <BoxShadowLoader />
    return (
        < >
            <section className="section section-slider">
                <div className='container-fluid'>
                    <div className="index-slider--wrap">
                        <div className="index-slider--banner">
                            <div className='index-slider--row'>
                                <div className="index-slider--coll coll-left">
                                    <div className="index-banner--top">
                                        <BannersSlide />
                                    </div>
                                    <div className="index-banner--bottom">
                                        <BannersBottom />
                                    </div>
                                </div>
                                <div className="index-slider--coll coll-right">
                                    <BannersRight />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <section className="section section-categories">
                <div className='container-fluid'>
                    <div className="wrapper-content">
                        <div className="section-heading">
                            <div className="box-header">
                                <h2 className="hTitle">
                                    <a href={`${URL}/collection/all`} >
                                        Danh mục sản phẩm
                                    </a>
                                </h2>
                            </div>
                        </div>
                        <div className="section-content">
                            <div className="list-row">
                                <div className='list-icon'>
                                    {categories && categories.map((cat, i) =>
                                        <div className="item-icon">
                                            <div className="item-img fade-box">
                                                <a href={`${URL}/collection/${cat._id}`} key={cat._id}>
                                                    <img src={IMAGE_BASEURL + cat?.CategoryImg?.url} alt="" />
                                                </a>
                                            </div>
                                            <div className="item-title">
                                                <h3>
                                                    <a href={`${URL}/collection/${cat._id}`} key={cat._id}>{cat.title}
                                                    </a>
                                                </h3>

                                            </div>
                                        </div>


                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='section section-collection'>
                <div className="container-fluid">
                    <div className="wrapper-content ">
                        <div className="section-heading">
                            <div className='box-left'>
                                <div className='box-header'>
                                    <h2 className="hTitle"> Sản Phẩm Được Đánh Giá Cao Nhất :</h2>
                                </div>
                            </div>
                            <div className='box-right'></div>
                        </div>
                        <div className='section-content'>
                            <Slider {...settings} className='slick-style style-pr '>
                                {topRatedProduct && topRatedProduct.products.map(product => (
                                    <ProductCard product={product} key={product._id} />
                                ))}
                            </Slider>

                        </div>
                    </div>
                </div>
            </section>


            {categories && categories.slice(0,5).map((cat, i) =>
                <section className='section section-collection'>
                    <div className="container-fluid">
                        <div className="wrapper-content ">
                            <div className="section-heading">
                                <div className='box-left'>
                                    <div className='box-header'>

                                        <h2 className="hTitle"> <a href={`${URL}/collection/${cat._id}`}>{cat.title}</a></h2>
                                    </div>
                                </div>
                                <div className='box-right'>
                                    <div className='box-link'>
                                        <a href={`${URL}/collection/${cat._id}`} key={cat} >xem tất cả <svg viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.768 9.94307C0.848883 9.98514 0.939696 10.0044 1.03069 9.99876C1.12169 9.99312 1.20943 9.96281 1.2845 9.91107L7.7845 5.41107C7.85092 5.36506 7.9052 5.30363 7.94269 5.23205C7.98017 5.16047 7.99976 5.08088 7.99976 5.00007C7.99976 4.91927 7.98017 4.83967 7.94269 4.7681C7.9052 4.69652 7.85092 4.63509 7.7845 4.58908L1.2845 0.0890755C1.20949 0.0371718 1.1217 0.00677802 1.03066 0.00118502C0.939609 -0.00440797 0.848767 0.015013 0.767965 0.0573451C0.687163 0.0996772 0.619482 0.163307 0.572248 0.241345C0.525015 0.319384 0.500031 0.408856 0.5 0.500075V9.50007C0.499985 9.59134 0.524952 9.68087 0.572194 9.75897C0.619436 9.83706 0.687151 9.90073 0.768 9.94307Z" fill="white"></path>
                                        </svg></a>
                                    </div>

                                </div>
                            </div>
                            <div className='section-content'>
                                <Slider {...settings} className=' slick-style style-pr '>
                                    {categoryProducts && categoryProducts[i]?.products.map(product =>
                                        <ProductCard product={product} key={product._id} />
                                    )}
                                </Slider>

                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>

    )
}

export default Home