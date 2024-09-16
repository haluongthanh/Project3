import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogCategoriesAuthorizeRole,resetMutationResult, selectAllBlogCategory, selectBlogCategoryMutationResult, deleteBlogCategory } from '../../../redux/features/blogCategorySlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { selectLoggedInUser } from '../../../redux/features/authSlice';
import jwtDecode from 'jwt-decode';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
const BlogCategoryList = () => {
    const dispatch = useDispatch();
   
    const { filteredBlogCategoriesCount, resultPerPage, blogCategories, loading } = useSelector(selectAllBlogCategory);
    const { success, error } = useSelector(selectBlogCategoryMutationResult);
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        status: '',
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult())
        }
        dispatch(getBlogCategoriesAuthorizeRole({ ...filters, toast }));
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
        dispatch(deleteBlogCategory({ id, toast }));
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
    const totalPages = Math.ceil(filteredBlogCategoriesCount / resultPerPage);
    if (blogCategories==undefined||loading==undefined) {
        return <BoxShadowLoader/>
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Danh Mục Tin</h1>

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

            {blogCategories.length === 0  ? (
                <div className="alert alert-info text-center" role="alert">
                    Không Tìm Thấy Danh Mục Tin.
                </div>
            ) :(
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Tiêu Đề</th>
                                    <th>Ảnh</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogCategories && blogCategories.map(blogCategory => (
                                    <tr key={blogCategory._id}>
                                        <td>{blogCategory.title}</td>
                                        <td><img src={`${IMAGE_BASEURL}${blogCategory?.blogCategoryImg?.url}`} alt="Banner" style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{translateStatus(blogCategory.Status)}</td>
                                        <td>
                                            <Link to={`/authorized/blogcategory/${blogCategory._id}`} className="btn btn-primary">
                                                <EditIcon/>
                                            </Link>
                                            <button onClick={() => handleDelete(blogCategory._id)} className="btn btn-danger ms-2">
                                               < DeleteForeverIcon/>
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

export default BlogCategoryList;
