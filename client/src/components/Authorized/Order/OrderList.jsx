import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, selectAllOrders, selectOrderMutationResult, deleteOrder, resetMutationResult } from '../../../redux/features/orderSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';

const OrderList = () => {
    const dispatch = useDispatch();
    const { filteredOrdersCount, resultPerPage, orders, totalAmount, loading } = useSelector(selectAllOrders);
    const { success } = useSelector(selectOrderMutationResult);

    const [filters, setFilters] = useState({
        search: '',
        currentPage: 1,
        startDate: '',
        endDate: '',
        status: '',
        paymentMethods: '',
        paymentStatus: '',
    });

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult());
        }
        dispatch(getAllOrders({ ...filters, toast }));
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
        dispatch(deleteOrder({ id, toast }));
    };

    const totalPages = Math.ceil(filteredOrdersCount / resultPerPage);
    if (orders == undefined || loading == undefined) {
        return <BoxShadowLoader />
    }
    return (
        <Box style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '15px', textAlign: 'center' }}>
            <Typography component='h1' variant='h5' sx={{ m: 4 }}>Danh Sách Đơn Hàng</Typography>

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
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Trạng Thái</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancel">Cancelled</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="paymentMethods"
                        value={filters.paymentMethods}
                        onChange={handleFilterChange}
                    >
                        <option value="">Phương thức thanh toán</option>
                        <option value="COD">COD</option>
                        <option value="Vnpay">Vnpay</option>

                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="paymentStatus"
                        value={filters.paymentStatus}
                        onChange={handleFilterChange}
                    >
                        <option value="">Trạng thái thanh toán</option>
                        <option value="paid">paid</option>
                        <option value="unpaid">unpaid</option>

                    </select>
                </div>

            </div>

            {orders.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Không tìm thấy đơn hàng.
                </div>) : (
                <>
                    <div className='table-responsive'>

                        <table className="table table-bordered">
                            <thead>
                                <tr className="table-secondary">
                                    <th>Order Code</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Payment Methods</th>
                                    <th>Payment Status</th>
                                    <th>Quantity</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order.orderCode}</td>
                                        <td>{order.shippingInfo.name}</td>
                                        <td>{order.shippingInfo.phone}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.paymentMethods}</td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{order.orderItems.length}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>
                                            <Link to={`/authorized/order/${order._id}`} className="btn btn-primary">
                                                <EditIcon />
                                            </Link>
                                            <IconButton
                                                color='error'
                                                onClick={() => handleDelete(order._id)}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
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
        </Box>
    );
};

export default OrderList;
