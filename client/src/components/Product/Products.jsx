import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Typography, Box, Slider  } from '@mui/material';
import { selectAllProducts, getProducts, resetProducts } from '../../redux/features/productSlice';
import { getCategories, selectAllCategories } from '../../redux/features/categorySlice';
import { getBrands, selectAllBrands } from '../../redux/features/brandSlice';

import './Product.css';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '../Skeletons/ProductCardSkeleton';
import HeadingWaveSkeleton from '../Skeletons/HeadingWaveSkeleton';
import { useLocation, useParams } from 'react-router';
import './test.css'
const Products = () => {
  const { id } = useParams();
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const { loading, products,price, filteredProductsCount, resultPerPage } = useSelector(selectAllProducts);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword');
  useEffect(() => {
    if (id === 'all') {
      setCategory('');
    } else {
      setCategory([id]);
    }
  }, [id]);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('' || keyword);
  let minPrice = 1;
  let maxPrice = 100000000000;
  const [priceRange, setPriceRange] = useState([ minPrice, maxPrice]);
  const [ratingsfilter, setRatingsFilter] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMorepage, setHasMorePage] = useState(true);

  const [active, setActive] = useState(false)
  const [sortByControl, setSortbyConTrol] = useState(false)
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    dispatch(resetProducts());
  }
  const handlePriceInputChange = (e) => {
    const value = e.target.value;
    if (e.target.name === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
    setCurrentPage(1);
    dispatch(resetProducts());
  };
  const priceHandler = (e, newPriceRange) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1);
    dispatch(resetProducts());
  }
  const ratingHandler = (e) => {
    setRatingsFilter(e.target.value);
    setCurrentPage(1);
    dispatch(resetProducts());
  }
  const handleListItemClick = (event, index, id) => {
    if (category.includes(id)) {
      setCategory(category.filter(cat => cat !== id));
      dispatch(resetProducts());

    } else {
      setCategory([...category, id]);
      dispatch(resetProducts());

    }
    setCurrentPage(1);
    dispatch(resetProducts());
  };
  const handleListItemClickBrand = (event, index, id) => {
    if (brand.includes(id)) {
      setBrand(brand.filter(brand => brand !== id));
      dispatch(resetProducts());

    } else {
      setBrand([...brand, id]);
      dispatch(resetProducts());

    }
    setCurrentPage(1);
    dispatch(resetProducts());
  };
  

  const { categories } = useSelector(selectAllCategories);
  const {brands} =useSelector(selectAllBrands);

  const observer = useRef();
  const lastElementRef = useCallback((lastElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMorepage) {
        setCurrentPage(prev => prev + 1)
      }
    })
    if (lastElement) observer.current.observe(lastElement)
  }, [loading, hasMorepage])

  const handleSetActive = () => {
    if (active == false) {
      setActive(true)
    } else {
      setActive(false)
    }
  }
  const handleSetSortByControl = () => {
    if (sortByControl == false) {
      setSortbyConTrol(true)
    } else {
      setSortbyConTrol(false)
    }
  }

  useEffect(() => {
    dispatch(resetProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories({ toast }));
    dispatch(getBrands({ toast }));

    const promise = dispatch(getProducts({ search, currentPage, priceRange, category,brand, ratingsfilter, toast }));
    return () => { promise.abort() }
  }, [dispatch, id ,search, currentPage, priceRange, category, ratingsfilter,brand])

  useEffect(() => {
    if (filteredProductsCount && resultPerPage) {
      setHasMorePage(Math.ceil(filteredProductsCount / resultPerPage) > currentPage)
    }
  }, [filteredProductsCount, resultPerPage, currentPage])

  return (
    <div class="container-fluid">
      <div class="collection-body">
        <div className={`collection-filter ${scrolled ? " fixed-head" : ""}`}>
          <div className={`filter-wrap scrolling ${scrolled ? "visible-title" : ""}`}>
            <div class="filter-total" >
              <div class={`filter-total--title jsFilter ${active == true ? "active" : ""}`} onClick={handleSetActive}>
                <svg class="icon icon-filter" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 1H1.5V3.47059L6.375 8.41176V15L9.625 12.9412V8.41176L14.5 3.47059V1Z" stroke="#111111" stroke-width="1.5" stroke-linejoin="round"></path>
                </svg>
                <span class="text">Bộ lọc</span>
                <span class="filter-number d-none">0</span>
                <div class="icon-arrow"></div>
              </div>
              <div class={`filter-total--content ${active == true ? "active" : ""}`}>
                <div class="filter-total--content-head">

                  <div class="filter-tags-btn">
                    <a class="filter-btn-close" onClick={handleSetActive}>
                      <svg class="icon-close" viewBox="0 0 19 19" role="presentation"><path d="M9.1923882 8.39339828l7.7781745-7.7781746 1.4142136 1.41421357-7.7781746 7.77817459 7.7781746 7.77817456L16.9705627 19l-7.7781745-7.7781746L1.41421356 19 0 17.5857864l7.7781746-7.77817456L0 2.02943725 1.41421356.61522369 9.1923882 8.39339828z" fill="currentColor" fill-rule="evenodd"></path></svg>
                      <span>Đóng</span>
                    </a>
                  </div>
                </div>
                <div class="filter-total--content-body">
                  <div class="list-filter--main">
                    <div class="filter-group">
                      <div className='filter-group--block'>
                        <div class="filter-group--title jsTitle">
                          <span data-text="Tình trạng sản phẩm">tìm kiếm sản phẩm</span>
                          <span class="icon-control"></span>
                          <span class="icon-arrow"></span>
                        </div>
                        <div class="filter-group--content" >
                          <div className='filter-search'>
                            <input type="text" value={search} onChange={handleSearch} className='filtter-search-input' />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="filter-group  ">
                      <div className='filter-group--block'>
                        <div class="filter-group--title jsTitle">
                          <span data-text="Category">Danh Mục</span>
                          <span class="icon-control"></span>
                          <span class="icon-arrow"></span>
                        </div>
                        <div class="filter-group--content" >
                          <ul class="checkbox-list">
                            {categories && categories.map((cat, index) =>
                              <li
                                key={cat._id}
                                onClick={(event) => handleListItemClick(event, index, cat._id)}
                                className={category.includes(cat._id) ? 'active' : ''}
                              >
                                <input type="checkbox" checked={category.includes(cat._id)} readOnly />
                                <label>{cat.title}</label>
                              </li>
                            )}
                          </ul>

                        </div>
                      </div>
                    </div>
                    <div class="filter-group  ">
                      <div className='filter-group--block'>
                        <div class="filter-group--title jsTitle">
                          <span data-text="Category">Thương Hiệu</span>
                          <span class="icon-control"></span>
                          <span class="icon-arrow"></span>
                        </div>
                        <div class="filter-group--content" >
                          <ul class="checkbox-list">
                            {brands && brands.map((br, index) =>
                              <li
                                key={br._id}
                                onClick={(event) => handleListItemClickBrand(event, index, br._id)}
                                className={brand.includes(br._id) ? 'active' : ''}
                              >
                                <input type="checkbox" checked={brand.includes(br._id)} readOnly />
                                <label>{br.title}</label>
                              </li>
                            )}
                          </ul>

                        </div>
                      </div>
                    </div>
                    <div class="filter-group">
                      <div className='filter-group--block'>
                        <div class="filter-group--title jsTitle">
                          <span data-text="Giá">Giá</span>
                          <span class="icon-control"></span>
                          <span class="icon-arrow"></span>
                        </div>
                        <div class="filter-group--content" >
                          <div class="range-slider">
                            <div class="range-price">
                              <span className="range-left">
                                <input
                                  type="number"
                                  name="minPrice"
                                  value={ priceRange[0]}
                                  onChange={handlePriceInputChange}
                                />
                              </span>
                              <span className="range-right">
                                <input
                                  type="number"
                                  name="maxPrice"
                                  value={priceRange[1]}
                                  onChange={handlePriceInputChange}
                                />
                              </span>
                            </div>
                            <Slider
                              value={priceRange}
                              min={minPrice}
                              step={1000}
                              max={maxPrice}
                              onChange={(e, newPriceRange) => priceHandler(e, newPriceRange)}
                              valueLabelDisplay="off"
                            />
                          </div>

                        </div>
                      </div>
                    </div>


                    <div class="filter-group">
                      <div className='filter-group--block'>
                        <div class="filter-group--title jsTitle">
                          <span data-text="By rating">By rating</span>
                          <span class="icon-control"></span>
                          <span class="icon-arrow"></span>
                        </div>
                        <div class="filter-group--content" >
                          <Slider
                            defaultValue={0}
                            min={0}
                            step={.1}
                            max={5}
                            onChange={ratingHandler}
                            valueLabelDisplay="on"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className='filter-single'>

            </div>
          </div>
          {/* <div class="collection-sortby">
            <div class="sortby-control" >
              <div class={`listbox__button js-sort ${sortByControl?'active' :"" }`} onClick={handleSetSortByControl}>
                <span class="listbox__text">Xếp theo:</span>
                <span class="listbox__value current-sort">Nổi bật</span>
              </div>
              <div  class={`listbox__list-wrapper sortby-option sortBy ${sortByControl?'show-sort' :"" }`} >
                <ul class="listbox__list">
                  <li class="listbox__item ">
                    <label>Giá tăng dần</label>
                  </li>
                  <li class="listbox__item " >
                    <label >Giá giảm dần</label>
                  </li>

                </ul>
              </div>
            </div>
          </div> */}
        </div>
        <Box className='container'>
          {loading && loading ? <HeadingWaveSkeleton /> :
            <Typography variant='div'
              component='h5'
              sx={{ ml: '10px', mb: '20px', textAlign: 'left' }}
            >
              {filteredProductsCount && filteredProductsCount > 0 ?
                `Found ${filteredProductsCount} items`
                :
                'Không tìm thấy sản phẩm'}
            </Typography>
          }
        </Box>

        <Box className='card-container'>
          {products && products.map((product, index) =>
            products.length === index + 1 ?
              <ProductCard ref={lastElementRef} product={product} key={product._id} />
              :
              <ProductCard product={product} key={product._id} />
          )}
        </Box>
        {loading &&
          <Box className='card-container'>

            {[...Array(8)].map((e, i) => (<ProductCardSkeleton key={i} />))}
          </Box>
        }
      </div>
    </div>

  )
}

export default Products