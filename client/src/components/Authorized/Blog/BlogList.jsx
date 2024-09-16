import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogsAuthorizeRole, selectAllBlog,resetMutationResult, selectBlogMutationResult, deleteBlog } from '../../../redux/features/blogSlice';
import { getBlogCategoriesAuthorizeRole, selectAllBlogCategory } from '../../../redux/features/blogCategorySlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const BlogList = () => {
  const dispatch = useDispatch();
  const { filteredBlogsCount, resultPerPage, blogs, loading } = useSelector(selectAllBlog);
  const { blogCategories } = useSelector(selectAllBlogCategory);
  const { success } = useSelector(selectBlogMutationResult);

  const [filters, setFilters] = useState({
    search: '',
    currentPage: 1,
    startDate: '',
    endDate: '',
    status: '',
    category: ''
  });

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult())
    }
    dispatch(getBlogsAuthorizeRole({ ...filters, toast }));
  }, [dispatch, success, filters]);

  useEffect(() => {
    dispatch(getBlogCategoriesAuthorizeRole());
  }, [dispatch]);

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
    dispatch(deleteBlog({ id, toast }));
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
  const totalPages = Math.ceil(filteredBlogsCount / resultPerPage);
  if (blogs==undefined||loading==undefined) {
    return <BoxShadowLoader/>
}
  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Danh Sách Tin</h1>

      <div className="row mb-3">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            placeholder="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
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
            {blogCategories && blogCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
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

      {blogs.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          Không Tìm Thấy TIn.
        </div>
      ) : (
        <>
          <div className='table-responsive'>

            <table className="table table-bordered">
              <thead>
                <tr className="table-secondary">
                  <th>Tiêu Đề</th>
                  <th>ẢNh</th>
                  <th>Danh Mục</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>
                      <img src={`${IMAGE_BASEURL}${blog?.ImageURL?.url}`} alt="Banner" style={{ width: '100px', height: 'auto' }} />
                    </td>
                    <td>{blog.blogCategory.title}</td>
                    <td>{translateStatus( blog.Status)}</td>
                    <td>
                      <Link to={`/authorized/blog/${blog._id}`} className="btn btn-primary">
                      <EditIcon/>
                      </Link>
                      <button onClick={() => handleDelete(blog._id)} className="btn btn-danger ms-2">
                        <DeleteForeverIcon/>
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

export default BlogList;
