import React,{useEffect,useState} from 'react'
import {useDispatch,useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import {axiosPublic} from '../../redux/axiosPublic';
import ProductCard from '../Product/ProductCard';
import {getCategories, selectAllCategories} from '../../redux/features/categorySlice';
import './layout.css'
import {Box, Typography} from '@mui/material';
import { Link,NavLink } from "react-router-dom";
import { IMAGE_BASEURL } from '../../constants/baseURL';
import BannersSlide from '../Banners/BannersSlide';
import BannersBottom from '../Banners/BannersBottom';
import BannersRight from '../Banners/BannersRight';
const Home = () => {
    const limit=4;
    const dispatch=useDispatch();
    const {categories}=useSelector(selectAllCategories);
 
    useEffect(() => {
      dispatch(getCategories({toast}));
    }, [dispatch]);
    
    const [topRatedProduct,setTopRatedProduct]=useState();
    useEffect(() => {
      const getProducts=async()=>{
        try{
            const response=await axiosPublic.get(`/products?&limit=${limit}&sort_by_ratings=${true}`)
            setTopRatedProduct(response.data);
        }catch(error){
            console.log(error);
        }
      }
      getProducts();
    }, [])

    const [categoryProducts,setCategoryProducts]=useState([]);
    const [catProductsLoading,setCatProductsLoading]=useState(false);

    useEffect(() => {
      if(categories){
        setCatProductsLoading(true);
        const getProducts=async()=>{
            try{
                const response=categories.map(async (category)=>
                    await axiosPublic.get(`/products?&limit=${limit}&category=${category._id}`))
                    Promise.all(response).then((values)=>{
                        setCategoryProducts([...categoryProducts,...values.map(value=>value.data)])
                    })
            }catch(error){
                console.log(error);
                setCatProductsLoading(false);
            }finally{
                setCatProductsLoading(false);
            }
        }
        getProducts();
      }
    }, [categories,catProductsLoading]);
    
    
  return (
    < >
        <section className="section section-slider">
            <div className='container-fluid'>
                <div className="index-slider--wrap">
                    <div className="index-slider--banner">
                        <div className='index-slider--row'>
                            <div className="index-slider--coll coll-left">
                                <div className="index-banner--top">
                                    <BannersSlide/>
                                </div>
                                <div className="index-banner--bottom">
                                    <BannersBottom/>
                                </div>
                            </div>
                            <div className="index-slider--coll coll-right">
                                <BannersRight/>
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
                                <Link to={`/collection/all`} >
                                    Danh mục sản phẩm
                                </Link>
                            </h2>
                        </div>
                    </div>
                    <div className="section-content">
                        <div className="list-row">
                            <div className='list-icon'>
                                {categories && categories.map((cat,i)=>
                                <div className="item-icon">
                                    <div className="item-img fade-box">
                                        <Link to={`/collection/${cat._id}`} key={cat._id}>
                                            <img src={IMAGE_BASEURL+cat?.CategoryImg?.url} alt="" />
                                            </Link>
                                    </div>
                                    <div className="item-title">
                                        <h3>
                                            <Link to={`/collection/${cat._id}`} key={cat._id}>{cat.title}
                                            </Link>
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
                                <h2 className="hTitle"> Top rated products :</h2>
                            </div>
                        </div>
                        <div className='box-right'></div>
                    </div>
                    <div className='section-content'>
                    <Box className='card-container'>
                      {topRatedProduct && topRatedProduct?.products.map(product=>(
                        <ProductCard product={product} key={product._id}/>
                    ))}
                    </Box>
                
                    </div>
                </div>
            </div>
        </section>

        
        {categories && categories.map((cat,i)=>
        <section className='section section-collection'>
            <div className="container-fluid">
                <div className="wrapper-content ">
                    <div className="section-heading">
                        <div className='box-left'>
                            <div className='box-header'>
                                <h2 className="hTitle"> {cat.title}</h2>
                            </div>
                        </div>
                        {/* <div className='box-right'>
                            <Link to={`/product/${cat.title}`} key={cat} >xem tất cả</Link>
                        </div> */}
                    </div>
                    <div className='section-content'>
                    <Box className='card-container'>
                        {categoryProducts && categoryProducts[i]?.products.map(product=>
                                <ProductCard product={product} key={product._id}/>
                            )}
                    </Box>
                
                    </div>
                </div>
            </div>
        </section>
        )}
    </>
    
  )
}

export default Home