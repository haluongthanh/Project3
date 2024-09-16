import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosPrivate from '../axiosPrivate';
import { toast } from 'react-toastify';
import { axiosPublic } from '../axiosPublic';

export const createOrder = createAsyncThunk('order/createOrder', async ({ order, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post('/orders', order);
        toast.success('Đã đặt hàng thành công.');
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const Payment = createAsyncThunk('order/payment', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.post('/create-payment-intent', jsonData);
        return data
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getMyOrders = createAsyncThunk('order/getMyOrders', async ({ status, toast }, { rejectWithValue }) => {
    try {
        let keystatus = 'status=' + status;
        let Params = keystatus;
        const { data } = await axiosPrivate.get(`/orders?${Params}`);
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const CancelOrder = createAsyncThunk('order/cancelOrder', async ({ id, toast }, { rejectWithValue }) => {
    try {

        const { data } = await axiosPrivate.get(`/cancelorder/${id}`);
        toast.success('Hủy đơn hàng thành công.')

        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})


export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.get(`/orders/${id}`);
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getAllOrders = createAsyncThunk('order/getAllOrders', async ({ search, currentPage, startDate, endDate, status, paymentStatus, paymentMethods, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (paymentStatus) query += `paymentStatus=${paymentStatus}&`;
        if (paymentMethods) query += `paymentMethods=${paymentMethods}&`
        if (status) query += `status=${status}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/authorized/orders?${query}`);
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getNotificationsOrders = createAsyncThunk('order/getNotificationsOrders', async ({ search, currentPage, startDate, endDate, status, paymentStatus, paymentMethods, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (paymentStatus) query += `paymentStatus=${paymentStatus}&`;
        if (paymentMethods) query += `paymentMethods=${paymentMethods}&`
        if (status) query += `status=${status}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/authorized/orders?${query}`);
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteOrder = createAsyncThunk('order/deleteOrder', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/authorized/orders/${id}`);
        toast.success('Đẫ xóa đơn hàng thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const updateOrder = createAsyncThunk('order/updateOrder', async ({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/authorized/orders/${id}`, jsonData);
        toast.success('Đã cập nhật đơn hàng thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        mutationResult: { success: false },
        orderlist: { orders: [] },
        orderDetails: { order: {} },
        Notifications: { orders: [] }
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        }
    },
    extraReducers: {
        //create order
        [createOrder.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [createOrder.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload;
        },
        [createOrder.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //get my orders
        [getMyOrders.pending]: (state, action) => {
            state.orderlist.loading = true;
        },
        [getMyOrders.fulfilled]: (state, action) => {
            state.orderlist.loading = false;
            state.orderlist.orders = action.payload.orders;
        },
        [getMyOrders.rejected]: (state, action) => {
            state.orderlist.loading = false;
            state.orderlist.error = action.payload;
        },
        //order details
        [getOrderDetails.pending]: (state, action) => {
            state.orderDetails.loading = true;
        },
        [getOrderDetails.fulfilled]: (state, action) => {
            state.orderDetails.loading = false;
            state.orderDetails.order = action.payload.order;
        },
        [getOrderDetails.rejected]: (state, action) => {
            state.orderDetails.loading = false;
            state.orderDetails.error = action.payload;
        },
        //get all orders by authorised role
        [getAllOrders.pending]: (state, action) => {
            state.orderlist.loading = true;
        },
        [getAllOrders.fulfilled]: (state, action) => {
            state.orderlist.loading = false;
            state.orderlist.orders = action.payload.orders;
            state.orderlist.orderCount = action.payload.orderCount;
            state.orderlist.totalAmount = action.payload.totalAmount;

            state.orderlist.resultPerPage = action.payload.resultPerPage;
            state.orderlist.filteredOrdersCount = action.payload.filteredOrdersCount;
        },
        [getAllOrders.rejected]: (state, action) => {
            state.orderlist.loading = false;
            state.orderlist.error = action.payload;
        },
        //delete an order
        [deleteOrder.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteOrder.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload;
        },
        [deleteOrder.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //delete an order
        [updateOrder.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateOrder.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload;
        },
        [updateOrder.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [getNotificationsOrders.pending]: (state, action) => {
            state.Notifications.loading = true;
        },
        [getNotificationsOrders.fulfilled]: (state, action) => {
            state.Notifications.loading = false;
            state.Notifications.orders = action.payload.orders;
            state.Notifications.orderCount = action.payload.orderCount;
            state.Notifications.totalAmount = action.payload.totalAmount;

            state.Notifications.resultPerPage = action.payload.resultPerPage;
            state.Notifications.filteredOrdersCount = action.payload.filteredOrdersCount;
        },
        [getNotificationsOrders.rejected]: (state, action) => {
            state.Notifications.loading = false;
            state.Notifications.error = action.payload;
        },
    }
});
export const selectOrderMutationResult = (state) => state.order.mutationResult;
export const selectAllOrders = (state) => state.order.orderlist;

export const selectOrderDetails = (state) => state.order.orderDetails;
export const selectNotificationsOrders = (state) => state.order.Notifications;

export const { resetMutationResult } = orderSlice.actions;
export default orderSlice.reducer;