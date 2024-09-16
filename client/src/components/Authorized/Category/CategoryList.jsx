import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, resetMutationResult, getCategoriesAuthorizeRole, selectAllCategories, selectCategoryMutationResult } from '../../../redux/features/categorySlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import { BASEURL } from '../../../constants/baseURL';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const CategoryList = () => {
    const dispatch = useDispatch();
    const { filteredCategiriesCount, resultPerPage, categories, loading } = useSelector(selectAllCategories);
    const { success } = useSelector(selectCategoryMutationResult);

    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        status: ''
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult())
        }
        dispatch(getCategoriesAuthorizeRole({ ...filters, toast }));
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
        dispatch(deleteCategory({ id, toast }));
    };
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
    const totalPages = Math.ceil(filteredCategiriesCount / resultPerPage);
    if (categories == undefined || loading == undefined) {
        return <BoxShadowLoader />
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Danh Mục</h1>

            <div className="mb-3">
                <div className="row">
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
                    <div className="col-md-2">
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

            </div>

            {loading && <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>}

            {categories.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Không Tìm Thấy Danh Mục.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Tiêu Đề</th>
                                    <th>Ảnh</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category._id}>
                                        <td>{category.title}</td>
                                        <td>
                                            <img src={`${BASEURL}${category?.CategoryImg?.url}`} alt={category.title} style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{translateStatus(category.Status)}</td>
                                        <td>
                                            <Link to={`/authorized/category/${category._id}`} className="btn btn-primary">
                                                < EditIcon />
                                            </Link>
                                            <button onClick={() => handleDelete(category._id)} className="btn btn-danger ms-2">
                                                < DeleteForeverIcon />
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

export default CategoryList;
