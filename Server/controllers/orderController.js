const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { logAction } = require('../utils/log')
const ApiFeatures =require('../utils/apiFeatures')
exports.newOrder = asyncHandler(async (req, res, next) => {
    req.body.addedBy = req.userInfo.userId;

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethods,
        paymentStatus,
        TradingCode,
        txnRef
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethods,
        paymentStatus,
        TradingCode,
        user: req.userInfo.userId,
        txnRef
    })

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity,req.body.status);
    })
    
    await logAction(
        'Create Order',
        'CREATE',
        'Order',
        order._id,
        req.userInfo.userId,
        null,
        req.body
    );

    res.status(201).json({ success: true, order });
})

exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'title images');
    if (!order) return next(new ErrorHandler('Đơn Hàng Không Tồn Tại.', 404));
    res.status(200).json({ success: true, order });
})

exports.myOrders = asyncHandler(async (req, res, next) => {
    const status = req.query.status;
    let query = { user: req.userInfo.userId };
    if (status) {
        query.orderStatus = status;
    }
    const orders = await Order.find(query)
        .populate('orderItems.product', 'title images')
        .sort({ createdAt: -1 });
        
    res.status(200).json({ success: true, orders });
});


exports.getAllOrders = asyncHandler(async (req, res, next) => {
    let resultPerPage = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy;
    if (req.query.sort_by_oldest) {
        if (req.query.sort_by_oldest === 'true') {
            sortBy = { createdAt: +1 };
        } else {
            sortBy = { createdAt: -1 };
        }
    } else {
        sortBy = { createdAt: -1 };
    }

    const orderCount = await Order.countDocuments();

    const apiFeature = new ApiFeatures(Order.find().populate('orderItems.product', 'title images').sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(Order.find().populate('orderItems.product', 'title images').sort(sortBy), req.query)
        .search()
        .filter();

    let filteredOrders = await filteredApiFeature.query;
    let filteredOrdersCount = filteredOrders.length;

    let totalAmount;
    if (!req.query.createdAt) {
        const allOrders = await Order.find(); 
        totalAmount = allOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    } else {
        totalAmount = filteredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    }

    apiFeature.pagination(resultPerPage);
    const orders = await apiFeature.query;
  
    res.status(200).json({
        success: true,
        orders,
        orderCount,
        resultPerPage,
        filteredOrdersCount,
        totalAmount
    });
});


exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    req.body.updatedBy = req.userInfo.userId;
    const oldValue = order;
    if (!order) return next(new ErrorHandler('Đơn Hàng Không Tồn Tại.', 404));
    if (order && order.orderStatus === "Cancel") {
        await logAction(
            'Delete Order',
            'DELETE',
            'Order',
            order._id,
            req.userInfo.userId,
            oldValue,
            null
        );
        await order.remove();
       

       
        res.status(200).json({ success: true });

    } else {
        next(new ErrorHandler('Không thể xóa đơn hàng', 400));

    }
})
exports.CancelOrder = asyncHandler(async (req, res, next) => {
    req.body.updatedBy = req.userInfo.userId;

    const orders = await Order.findOne({ user: req.userInfo.userId, _id: req.params.id });
    const oldValue = orders;

    if (orders && orders.orderStatus === "Processing") {
        orders.orderStatus = "Cancel";
        orders.CancelAt = Date.now();
        orders.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity, orders.orderStatus);
        })
        await logAction(
            'Update Order',
            'UPDATE',
            'Order',
            orders._id,
            req.userInfo.userId,
            oldValue,
            req.body
        );
        await orders.save();
        
        res.status(200).json({ success: true });
    } else {
        next(new ErrorHandler('Can not Cancel Order', 400));
    }
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    req.body.updatedBy = req.userInfo.userId;
    const oldValue = order;
    if (!order) return next(new ErrorHandler('Đơn Hàng Không Tồn Tại.', 404));
    if (order.orderStatus === 'Delivered') return next(new ErrorHandler('Bạn đã giao sản phẩm này rồi', 400));
    if (order.orderStatus === 'Proccessing' && req.body.status === 'Delivered') return next(new ErrorHandler('Không thể giao hàng trước khi vận chuyển.', 400));

    // if (req.body.status === 'Shipped') {
    //     order.orderItems.forEach(async (o) => {
    //         await updateStock(o.product, o.quantity,req.body.status);
    //     })
    // }
    if(req.body.status=='Cancel'){
        order.CancelAt = Date.now();
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity,req.body.status);
        })
    }
    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }
    await logAction(
        'Update Order',
        'UPDATE',
        'Order',
        order._id,
        req.userInfo.userId,
        oldValue,
        req.body
    );
    await order.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
})
exports.CheckTxnRef = asyncHandler(async (req, res, next) => {
    try {
        const { txnRef } = req.params;
        const order = await Order.findOne({ txnRef });

        if (order) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});
async function updateStock(id, quantity,status) {
    const product = await Product.findById(id);
    if (status=='Cancel') {
        product.stock+=quantity;
    }else{
        product.stock -= quantity;

    }
    await product.save({ validateBeforeSave: false });
}