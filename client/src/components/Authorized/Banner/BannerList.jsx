import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBannersAuthorizeRole, resetMutationResult, selectAllBanner, selectBannerMutationResult, deleteBanner } from '../../../redux/features/bannerSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const BannerList = () => {
    const dispatch = useDispatch();
    const { filteredBannersCount, resultPerPage, banners, loading } = useSelector(selectAllBanner);
    const { success, error } = useSelector(selectBannerMutationResult);
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
        dispatch(getBannersAuthorizeRole({ ...filters, toast }));
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
        dispatch(deleteBanner({ id, toast }));
    };
    const translateStatus = (status) => {
        switch (status) {
            case 'pause':
                return 'Tạm Dừng';
            case 'slide':
                return 'Thanh Trượt';
            case 'bottom':
                return 'Dưới';
            case 'right':
                return 'Phải';
            default:
                return status;
        }
    };
    
    const totalPages = Math.ceil(filteredBannersCount / resultPerPage);
    if (banners == undefined || loading == undefined) {
        return <BoxShadowLoader />
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Biểu Ngữ</h1>

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
                            <option value="pause">Tạm Dừng </option>
                            <option value="slide">Thanh Trượt</option>
                            <option value="bottom">Dưới</option>
                            <option value="right">Phải</option>
                        </select>
                    </div>
                </div>

            </div>

            {banners.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Không tìm thấy biểu ngữ.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>
                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Tiêu Đề</th>
                                    <th>Ảnh</th>
                                    <th>Trang Thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners && banners.map(banner => (
                                    <tr key={banner._id}>
                                        <td>{banner.title}</td>
                                        <td>
                                            <img src={`${IMAGE_BASEURL}${banner?.ImageURL?.url}`} alt="Banner" style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{translateStatus(banner.Status)}</td>
                                        <td>
                                            <Link to={`/authorized/banner/${banner._id}`} className="btn btn-primary">
                                                <EditIcon />
                                            </Link>
                                            <button onClick={() => handleDelete(banner._id)} className="btn btn-danger ms-2">
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

export default BannerList;
