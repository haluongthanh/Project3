import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Typography, Box, Grid, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserList, getAllUsers, deleteUser, resetMutationResult, selectMutationResult } from '../../../redux/features/authSlice';
import { selectAllProducts, getProductsByAuthorizeRoles } from '../../../redux/features/productSlice';
import { getAllOrders, selectAllOrders } from '../../../redux/features/orderSlice';
import { getBlogs, selectAllBlog } from '../../../redux/features/blogSlice';

import { Doughnut, Line } from 'react-chartjs-2';
import chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { IMAGE_BASEURL } from '../../../constants/baseURL';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stock, products, productCount } = useSelector(selectAllProducts);
    const { users, userCount, filteredUsersCount, resultPerPage, loading } = useSelector(selectUserList);
    const { blogs, blogCount } = useSelector(selectAllBlog);
    const { success } = useSelector(selectMutationResult);
    const { orders, orderCount, totalAmount } = useSelector(selectAllOrders);
    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        blocked: '',
        role: ''
    });
console.log(stock)
    useEffect(() => {
        dispatch(getProductsByAuthorizeRoles({ toast }));
        dispatch(getAllOrders({ toast }));
        dispatch(getAllUsers({ toast }));
        dispatch(getBlogs({toast}))
        if (success) {
            dispatch(resetMutationResult());
        }
    }, [dispatch, success]);

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
    if (stock === undefined
        || blogCount===undefined 
        || totalAmount===undefined 
        || users===undefined 
        || userCount===undefined 
        || productCount===undefined) {
        return <BoxShadowLoader />
    }

    const lineData = {
        labels: ['Initial Amount', 'Amount Earned'],
        datasets: [
            {
                label: 'Total Amount',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                data: [0, totalAmount],
            }
        ]
    };

    const doughnutData = {
        labels: ['Out Of Stock', 'In Stock'],
        datasets: [
            {
                backgroundColor: ['red', 'green'],
                hoverBackgroundColor: ['black', 'blue'],
                data: [stock.outOfStock, stock.inStock]
            }
        ]
    };
    const totalPages = Math.ceil(filteredUsersCount / resultPerPage);
    
    return (
        <>
            <Box className='dash-box'>
                <Grid container sx={{ alignItems: 'center', mt: 1, textAlign: 'center' }} spacing={3}>
                    <Grid item xs={4}>
                        <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>Products</Typography>
                        <Divider />
                        <Typography variant='button' component='div'>{productCount}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>Users</Typography>
                        <Divider />
                        <Typography variant='button' component='div'>{userCount}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>Blogs</Typography>
                        <Divider />
                        <Typography variant='button' component='div'>{blogCount}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>Orders</Typography>
                        <Divider />
                        <Typography variant='button' component='div'>{orderCount}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>Ordered Amount</Typography>
                        <Divider />
                        <Typography variant='button' component='div'>{totalAmount}</Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ alignItems: 'center', mt: 1, textAlign: 'center' }} spacing={3}>
                    <Grid item xs={6}><Line data={lineData} /></Grid>
                    <Grid item xs={4}> <Doughnut data={doughnutData} /></Grid>
                </Grid>

                <div className="container mt-4">
                    <h1 className="mb-4 text-center"> List of Users</h1>

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
                                    <option value='manage'>Manage</option>
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
                                    <option value="">All Status</option>
                                    <option value="true">true</option>
                                    <option value="false">false</option>
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
                                                        <EditIcon />
                                                    </Link>
                                                    <button onClick={() => handleDelete(user._id)} className="btn btn-danger ms-2">
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
            </Box>
        </>
    );
};

export default AdminDashboard;
