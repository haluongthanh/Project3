import React from 'react'
import {getBlogs,selectAllBlog} from '../../redux/features/blogSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import {toast} from 'react-toastify';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import './BlogLayout.css'

const Blog = () => {
    const dispatch =useDispatch();
    const{blogs}=useSelector(selectAllBlog);
    useEffect(() => {
        dispatch(getBlogs({toast}));
      }, [dispatch]);
    
    return ( 
    <main className="wrapperMain_content">
        <div class="breadcrumb-wrap">
            <div class="container-fluid">
                <div class="breadcrumb-list  ">
                    <ol class="breadcrumb breadcrumb-arrows" >
                        <li itemprop="itemListElement">
                            <a href="/" target="_self" >
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.25895 13.1594V8.95647H9.73718V13.1594C9.73718 13.6217 10.1285 14 10.6067 14H13.2154C13.6937 14 14.085 13.6217 14.085 13.1594V7.27529H15.5632C15.9632 7.27529 16.1545 6.79616 15.8502 6.54398L8.58067 0.21435C8.25024 -0.07145 7.7459 -0.07145 7.41546 0.21435L0.145957 6.54398C-0.149693 6.79616 0.0329144 7.27529 0.432911 7.27529H1.91116V13.1594C1.91116 13.6217 2.30246 14 2.78072 14H5.38939C5.86765 14 6.25895 13.6217 6.25895 13.1594Z" fill="#1982F9"></path>
                                </svg>
                                <span itemprop="name">Trang chủ</span>
                            </a>
                            <meta itemProp="postion" content="1"></meta>		
                        </li>
                                
                        
                        <li class="active" i>
                            <span itemprop="item" ><strong itemprop="name">Tất cả bài viết</strong></span>
                            <meta itemProp="postion" content="2"></meta>		
                        </li>
                        
                        
                    </ol>
                </div>
            </div>
        </div>
        <div className="blog-body">
            <div className="container-fluid">
                <div className="blog-content">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-3 col-xl-3">
                            <div className="blog-posts"></div>
                            <div className="list-article-content row">
                                {blogs && blogs.map((blogs)=>(
                                    <div className="col-post ">
                                        <div className="post_item">
                                            <div className="post_featured coll-l">
                                                <a href="">
                                                    <picture >
                                                        <img src={IMAGE_BASEURL+blogs?.ImageURL?.url} alt="" />
                                                    </picture>
                                                </a>
                                            </div>
                                            <div className="post_content coll-r">
                                                <div className="post_title">
                                                    <a href="">{blogs.title}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    )
}

export default Blog