import React, { useState, useEffect } from 'react';
import { selectAllBlog, getBlogs, resetBlogs } from '../../redux/features/blogSlice';
import { selectAllBlogCategory, getBlogsCategory } from '../../redux/features/blogCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BASEURL, IMAGE_BASEURL } from '../../constants/baseURL';
import './blog.css';
import { useParams } from 'react-router';
import { formatDate } from '../../utility/formatDate';
import BoxShadowLoader from '../Skeletons/BoxShadowLoader';
const Blog = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const dispatch = useDispatch();
  const { blogs, filteredBlogsCount, resultPerPage } = useSelector(selectAllBlog);
  const { blogCategorys } = useSelector(selectAllBlogCategory);
  const [hasMorepage, setHasMorePage] = useState(true);
  console.log(currentPage)

  useEffect(() => {

    if (id === 'all') {
      setCategory('');
    } else {
      setCategory(id);
    }
  }, [id]);

  useEffect(() => {
    dispatch(resetBlogs());
  }, [dispatch]);

  const handleViewMore = () => {
    setCurrentPage(prev => prev + 1);
  }

  useEffect(() => {
    const promise = dispatch(getBlogs({ search, currentPage, category, toast }));
    dispatch(getBlogsCategory({ toast }));
    return () => { promise.abort() }

  }, [dispatch, category, id, currentPage]);
  useEffect(() => {
    if (filteredBlogsCount && resultPerPage) {
      setHasMorePage(Math.ceil(filteredBlogsCount / resultPerPage) > currentPage)
    }
  }, [filteredBlogsCount, resultPerPage, currentPage])
  if (blogs == undefined || blogCategorys == undefined) { return <BoxShadowLoader /> }
  return (
    <div className="blog-layout">
      <div className="breadcrumb-wrap">
        <div className="container-fluid">
          <div className="breadcrumb-list">
            <ol className="breadcrumb breadcrumb-arrows">
              <li itemProp="itemListElement">
                <a href="/">
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.25895 13.1594V8.95647H9.73718V13.1594C9.73718 13.6217 10.1285 14 10.6067 14H13.2154C13.6937 14 14.085 13.6217 14.085 13.1594V7.27529H15.5632C15.9632 7.27529 16.1545 6.79616 15.8502 6.54398L8.58067 0.21435C8.25024 -0.07145 7.7459 -0.07145 7.41546 0.21435L0.145957 6.54398C-0.149693 6.79616 0.0329144 7.27529 0.432911 7.27529H1.91116V13.1594C1.91116 13.6217 2.30246 14 2.78072 14H5.38939C5.86765 14 6.25895 13.6217 6.25895 13.1594Z" fill="#1982F9"></path>
                  </svg>
                  <span itemProp="name">Trang chủ</span>
                </a>
              </li>
              <li className="active">
                <span itemProp="item">
                  <strong itemProp="name">Tất cả bài viết</strong>
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="blog-body">
        <div className="container-fluid">
          <div className="blog-content">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-9 col-xl-9">
                <div className="blog-posts">
                  <div className="list-article-content row">
                    {blogs.length === 0 ? (<div className="alert alert-info text-center" role="alert">
                      Không Tìm Thấy Tin.
                    </div>) : (
                      <>{blogs &&
                        blogs.map((item, i) => (
                          <div className="col-post" key={i}>
                            <div className="post_item">
                              <div className="post_featured coll-l">
                                <div className="post_thumb fade-box">
                                  <a href={`/blog/${item._id}`} className="aspect-ratio">
                                    <picture>
                                      <img src={IMAGE_BASEURL + item.ImageURL.url} alt="" className="lazyloaded" />
                                    </picture>
                                  </a>
                                </div>
                              </div>
                              <div className="post_content coll-r">
                                <div className="post_title">
                                  <a href={`/blog/${item._id}`}>{item.title}</a>
                                </div>
                                <div className="post_info">
                                  <div className="post_info_item date">
                                    <span className="post_info_item date">
                                      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.49968 3.99967C8.32287 3.99967 8.1533 4.06991 8.02827 4.19494C7.90325 4.31996 7.83301 4.48953 7.83301 4.66634V7.33301H6.49968C6.32287 7.33301 6.1533 7.40325 6.02827 7.52827C5.90325 7.65329 5.83301 7.82286 5.83301 7.99967C5.83301 8.17649 5.90325 8.34605 6.02827 8.47108C6.1533 8.5961 6.32287 8.66634 6.49968 8.66634H8.49968C8.67649 8.66634 8.84606 8.5961 8.97108 8.47108C9.09611 8.34605 9.16634 8.17649 9.16634 7.99967V4.66634C9.16634 4.48953 9.09611 4.31996 8.97108 4.19494C8.84606 4.06991 8.67649 3.99967 8.49968 3.99967ZM8.49968 1.33301C7.18114 1.33301 5.8922 1.724 4.79588 2.45654C3.69955 3.18909 2.84506 4.23028 2.34048 5.44845C1.8359 6.66663 1.70387 8.00707 1.96111 9.30028C2.21834 10.5935 2.85328 11.7814 3.78563 12.7137C4.71798 13.6461 5.90587 14.281 7.19908 14.5382C8.49228 14.7955 9.83273 14.6635 11.0509 14.1589C12.2691 13.6543 13.3103 12.7998 14.0428 11.7035C14.7754 10.6071 15.1663 9.31822 15.1663 7.99967C15.1644 6.23216 14.4614 4.5376 13.2116 3.28777C11.9618 2.03795 10.2672 1.33495 8.49968 1.33301ZM8.49968 13.333C7.44484 13.333 6.4137 13.0202 5.53664 12.4342C4.65957 11.8481 3.97599 11.0152 3.57232 10.0407C3.16865 9.06611 3.06304 7.99376 3.26882 6.95919C3.47461 5.92463 3.98256 4.97432 4.72844 4.22844C5.47432 3.48256 6.42463 2.97461 7.4592 2.76882C8.49376 2.56303 9.56612 2.66865 10.5407 3.07232C11.5152 3.47598 12.3481 4.15957 12.9342 5.03663C13.5202 5.91369 13.833 6.94484 13.833 7.99967C13.8312 9.41362 13.2688 10.7691 12.269 11.769C11.2692 12.7688 9.91362 13.3312 8.49968 13.333Z" fill="#535353"></path>
                                      </svg>
                                      {formatDate(item.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {hasMorepage && blogs && blogs.length > 0 ? <div class="view-more-blog"><a onClick={handleViewMore}>
                          Xem thêm bài viết
                          <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.80717 2.518C1.7651 2.59888 1.74585 2.6897 1.75149 2.78069C1.75713 2.87169 1.78744 2.95943 1.83917 3.0345L6.33917 9.5345C6.38518 9.60092 6.44661 9.6552 6.51819 9.69268C6.58977 9.73017 6.66937 9.74976 6.75017 9.74976C6.83097 9.74976 6.91057 9.73017 6.98215 9.69268C7.05373 9.6552 7.11515 9.60092 7.16117 9.5345L11.6612 3.0345C11.7131 2.95949 11.7435 2.8717 11.7491 2.78066C11.7547 2.68961 11.7352 2.59877 11.6929 2.51796C11.6506 2.43716 11.5869 2.36948 11.5089 2.32225C11.4309 2.27502 11.3414 2.25003 11.2502 2.25L2.25017 2.25C2.1589 2.24998 2.06937 2.27495 1.99128 2.32219C1.91319 2.36944 1.84952 2.43715 1.80717 2.518Z" fill="#1982F9"></path>
                          </svg>
                        </a></div> : ''}</>
                    )}

                  </div>


                </div>
              </div>
              <div className="col-12 col-md-12 col-lg-3 col-xl-3">
                <div class="sidebar-blog all">
                  <div className="sidebar-box blog--cate">
                    <div className="sidebar-box--title">
                      <h2 className="hot">
                        Danh Mục
                        <span className="icon" style={{ right: '-7px', width: '45px' }}></span>
                      </h2>
                    </div>
                    <div className="sidebar-box--list">
                      <div className="list-cate">
                        {blogCategorys &&
                          blogCategorys.map((item, i) => (
                            <div className="item-cate" key={i}>
                              <div className="img">
                                <a href={`/blogs/${item._id}`}>
                                  <img src={IMAGE_BASEURL + item.blogCategoryImg.url} alt="" />
                                </a>
                              </div>
                              <h3><a href={`/blogs/${item._id}`}>{item.title}</a></h3>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
