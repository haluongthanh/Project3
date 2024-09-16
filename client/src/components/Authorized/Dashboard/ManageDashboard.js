import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, selectAllOrders, selectOrderMutationResult, deleteOrder, resetMutationResult } from '../../../redux/features/orderSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Pagination from '../../../utility/Pagination';
import { Box, Typography, IconButton, Tooltip, Divider, Grid } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { formatCurrency } from '../../../utility/formatCurrency';
import { Doughnut, Line } from 'react-chartjs-2';
import { selectAllProducts, getProductsByAuthorizeRoles } from '../../../redux/features/productSlice';
import { getBlogs, selectAllBlog } from '../../../redux/features/blogSlice';

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { filteredOrdersCount, resultPerPage, orders, orderCount, totalAmount, loading } = useSelector(selectAllOrders);
  const { success } = useSelector(selectOrderMutationResult);
  const { stock, products, productCount } = useSelector(selectAllProducts);
  const { blogs, blogCount } = useSelector(selectAllBlog);

  const [filters, setFilters] = useState({
    search: '',
    currentPage: 1,
    startDate: '',
    endDate: '',
    status: '',

  });

  useEffect(() => {
    dispatch(getProductsByAuthorizeRoles(toast))
    dispatch(getAllOrders({ toast }))
    dispatch(getBlogs({ toast }))
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
  if (orders == undefined
    || orderCount == undefined
    || loading == undefined
    || stock === undefined
    || blogCount === undefined
    || totalAmount === undefined
    || productCount === undefined) {
    return <BoxShadowLoader />
  }
  const totalPages = Math.ceil(filteredOrdersCount / resultPerPage);


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
  }
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
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '15px' }}>
      <Typography component='h1' variant='h5' sx={{ m: 4, textAlign: 'center' }}>Manage Dashboard </Typography>
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
        <div className="col-md-2">
          <select
            className="form-control"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-control"
            name="paymentMethods"
            value={filters.paymentMethods}
            onChange={handleFilterChange}
          >
            <option value="">Payment Methods</option>
            <option value="COD">COD</option>
            <option value="Vnpay">Vnpay</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-control"
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
          >
            <option value="">Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>
      <Box className='dash-box'>
        <Grid container sx={{ alignItems: 'center', mt: 1, textAlign: 'center' }} spacing={3}>
          <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>
              Total Orders
            </Typography>
            <Divider />
            <Typography variant='button' component='div'>
              {orderCount}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>
              Products Count
            </Typography>
            <Divider />
            <Typography variant='button' component='div'>
              {productCount}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>
              Blogs Count
            </Typography>
            <Divider />
            <Typography variant='button' component='div'>
              {blogCount}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant='button' component='div' sx={{ color: '#fff', background: '#1976d2' }}>
              Total Amount
            </Typography>
            <Divider />
            <Typography variant='button' component='div'>
              {formatCurrency(totalAmount)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ alignItems: 'center', mt: 1, textAlign: 'center' }} spacing={2}>
          <Grid item xs={5}><Line data={lineData} /></Grid>
          <Grid item xs={3}> <Doughnut data={doughnutData} /></Grid>

        </Grid>
      </Box>



      {orders.length === 0 ? (
        <Box textAlign='center' py={2}>
          <Typography>No orders found.</Typography>
        </Box>
      ) : (
        <>
          <Box className='table-responsive'>
            <table className="table table-bordered">
              <thead>
                <tr className="table-secondary">
                  <th>Order ID</th>
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
                    <td>{order._id}</td>
                    <td>{order.shippingInfo.name}</td>
                    <td>{order.shippingInfo.phone}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.paymentMethods}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.orderItems.length}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
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
          </Box>
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

export default SellerDashboard;
