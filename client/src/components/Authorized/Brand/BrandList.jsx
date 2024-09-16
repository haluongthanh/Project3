import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBrandsAuthorizeRole, deleteBrand, resetMutationResult, selectAllBrands, selectBrandMutationResult } from '../../../redux/features/brandSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination'; // Bạn cần tạo component Pagination nếu chưa có
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const BrandList = () => {
    const dispatch = useDispatch();
    const { filteredBrandsCount, resultPerPage, brands, loading } = useSelector(selectAllBrands);
    const { success, error } = useSelector(selectBrandMutationResult);
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        status: '',
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult());
        }
        dispatch(getBrandsAuthorizeRole({ ...filters, toast }));
    }, [dispatch, filters, success]);

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
        dispatch(deleteBrand({ id, toast }));
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
    const totalPages = Math.ceil(filteredBrandsCount / resultPerPage);
    if (brands == undefined || loading == undefined) {
        return <BoxShadowLoader />
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Thương Hiệu</h1>

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

            </div>

            {loading && <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>}

            {brands.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Không tìm Thấy Thương Hiệu.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Tiêu Đề</th>
                                    <th>Mô Tả</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands && brands.map(brand => (
                                    <tr key={brand._id}>
                                        <td>{brand.title}</td>
                                        <td>{brand.description}</td>
                                        <td>{translateStatus(brand.Status)}</td>
                                        <td>
                                            <Link to={`/authorized/brand/${brand._id}`} className="btn btn-primary">
                                                <EditIcon />
                                            </Link>
                                            <button onClick={() => handleDelete(brand._id)} className="btn btn-danger ms-2">
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
                    /></>
            )}

        </div>
    );
};

export default BrandList;
