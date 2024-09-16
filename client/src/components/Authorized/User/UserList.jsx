import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, resetMutationResult, selectUserList, selectMutationResult, deleteUser } from '../../../redux/features/authSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
const UserList = () => {
    const dispatch = useDispatch();
    const { filteredUsersCount, resultPerPage, users, loading } = useSelector(selectUserList);
    const { success } = useSelector(selectMutationResult);
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        blocked: '',
        role:''
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult());
        }
        dispatch(getAllUsers({ ...filters, toast }));
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
        dispatch(deleteUser({ id, toast }));
    };

    const totalPages = Math.ceil(filteredUsersCount / resultPerPage);
    if (users==undefined||loading==undefined) {
        return <BoxShadowLoader/>
    }
    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Danh Sách Người Dùng</h1>

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
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                        >
                            <option value="">Roles</option>
                            <option value='admin'>Admin</option>
                            <option value='manager'>Manager</option>
                            <option value='staff'>Staff</option>
                            <option value='user'>User</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-control"
                            name="blocked"
                            value={filters.blocked}
                            onChange={handleFilterChange}
                        >
                            <option value="">Trạng Thái</option>
                            <option value="true">Block</option>
                            <option value="false">Hoạt Động</option>
                        </select>
                    </div>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Users Not found.
                </div>
            ) : (
                <>
                    <div className='table-responsive'>
                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Name</th>
                                    <th>Avatar</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>
                                            <img src={`${IMAGE_BASEURL}${user.avatar.url}`} alt="Avatar" style={{ width: '100px', height: 'auto' }} />
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.roles}</td>
                                        <td>
                                            <Link to={`/authorized/user/${user._id}`} className="btn btn-primary">
                                                <EditIcon/>
                                            </Link>
                                            <button onClick={() => handleDelete(user._id)} className="btn btn-danger ms-2">
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

export default UserList;
