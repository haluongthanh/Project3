import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsByAuthorizeRoles, selectAllProducts, resetMutationResult, selectProductMutationResult, deleteProduct } from '../../../redux/features/productSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import { BASEURL, IMAGE_BASEURL } from '../../../constants/baseURL';
import { selectAllCategories, getCategoriesAuthorizeRole } from '../../../redux/features/categorySlice';
import { selectAllBrands, getBrandsAuthorizeRole } from '../../../redux/features/brandSlice'
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const ProductList = () => {
    const dispatch = useDispatch();
    const { filteredProductsCount, resultPerPage, products, loading } = useSelector(selectAllProducts);
    const { success } = useSelector(selectProductMutationResult);
    const { categories } = useSelector(selectAllCategories);
    const { brands } = useSelector(selectAllBrands)
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        status: '',
        category: '',
        brand: ''
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult());
        }
        dispatch(getBrandsAuthorizeRole({ toast }))
        dispatch(getCategoriesAuthorizeRole({ toast }))
        dispatch(getProductsByAuthorizeRoles({ ...filters, toast }));
    }, [dispatch, success, filters]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handlePageChange = (page) => {
        setFilters({
            ...filters,
            currentPage: page
        });
    };

    const handleDelete = (id) => {
        dispatch(deleteProduct({ id, toast }));
    };
    const totalPages = Math.ceil(filteredProductsCount / resultPerPage);
    if (products == undefined
        || loading == undefined
        || categories == undefined || brands == undefined) {
        return <BoxShadowLoader />
    }
    const translateStatus = (status) => {
        switch (status) {
            case 'pause':
                return 'Tạm Dừng';
            case 'active':
                return 'Hoạt Động';

            default:
                return status;
        }
    };
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Sản Phẩm</h1>

            <div className="row mb-3">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Start Date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        placeholder="End Date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                    >
                        <option value="">Danh Mục</option>
                        {categories && categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="brand"
                        value={filters.brand}
                        onChange={handleFilterChange}
                    >
                        <option value="">Thương Hiệu</option>
                        {brands && brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                                {brand.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Trạng Thái</option>
                        <option value="active">Hoạt Động</option>
                        <option value="pause">Tạm Dừng</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : products.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Không Tìm Thấy Sản Phẩm.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Tiêu Đề</th>
                                    <th>Hình Ảnh</th>
                                    <th>Số Lượng</th>

                                    <th>Thương Hiệu</th>
                                    <th>Danh Mục</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product.title}</td>
                                        <td>
                                            <img src={`${IMAGE_BASEURL}${product?.images[0]?.url}`} alt="Product" style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{product.stock}</td>
                                        <td>{product.brand.title}</td>
                                        <td>{product.category.title}</td>
                                        <td>{translateStatus(product.Status)}</td>
                                        <td>
                                            <Link to={`/authorized/product/${product._id}`} className="btn btn-primary">
                                                < EditIcon />
                                            </Link>
                                            <button onClick={() => handleDelete(product._id)} className="btn btn-danger ms-2">
                                                <DeleteForeverIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={filters.currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ProductList;
