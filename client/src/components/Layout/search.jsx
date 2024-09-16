import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./search.css";
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { formatCurrency } from '../../utility/formatCurrency';
import { BASEURL,URL } from '../../constants/baseURL';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(timerId);
        };
    }, [query]);

    useEffect(() => {
        const search = async () => {
            if (debouncedQuery) {
                const { data } = await axios.get(`${BASEURL}/api/v1/products?keyword=${debouncedQuery}`);
                setResults(data.products);
            }
        };
        search();
    }, [debouncedQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query) {
            window.location.href=`${URL}/collection/all?keyword=${query}`
        }
    };

    return (
        <div className='header-action-item main-header--search'>
            <div className="header-action_dropdown_mb search-box wpo-wrapper-search">
                <form onSubmit={handleSearch} className="searchform-product searchform-categoris ultimate-search">
                    <div className="wpo-search-inner">
                        <input
                            type="text"
                            className="input-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm Kiếm Sản Phẩm..."
                        />
                    </div>
                    <button type="submit" className="btn-search btn" id="btn-search">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.9999 19C15.4182 19 18.9999 15.4183 18.9999 11C18.9999 6.58172 15.4182 3 10.9999 3C6.5816 3 2.99988 6.58172 2.99988 11C2.99988 15.4183 6.5816 19 10.9999 19Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M20.9999 21L16.6499 16.65" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                </form>
                {query !== "" ? (
                    <div className="smart-search-wrapper ajaxSearchResults">
                        {results.length > 0 ?
                            <div className="resultsContent">
                                {results.map((result) => (
                                    <div className="item-ult" key={result._id}>
                                        <div className="thumbs">
                                            <a href={`${URL}/product/${result._id}`} title={result.title}>
                                                <img src={IMAGE_BASEURL + result.images[0].url} alt={result.title} />
                                            </a>
                                        </div>
                                        <div className="title">
                                            <a href={`${URL}/product/${result._id}`}>{result.title}</a>
                                            <p className="f-initial">
                                                {result.discount > 0 ? (
                                                    <>
                                                        <span>{formatCurrency(result.price - result.discount)}</span>
                                                        <del> {formatCurrency(result.price)}</del>
                                                    </>
                                                ) : (
                                                    <span>{formatCurrency(result.price)}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            :
                            <div className="resultsContent nodata">
                                <div className="dataEmpty">Không tìm thấy sản phẩm nào.</div>
                            </div>
                        }
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchBar;
