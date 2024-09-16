const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid'); 

const orderSchema = new mongoose.Schema({
    orderCode: {
        type: String,
        unique: true, 
        required: true,
        default: () => uuidv4(),
    },
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        ward: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true,
        }
    },
    orderItems: [{
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true
        },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentMethods: {
        type: String,
        enum: ['COD', 'Vnpay'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    txnRef: {
        type: String,
    },
    paidAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancel'],
        default: 'Processing'
    },
    deliveredAt: Date,
    CancelAt: Date
}, {
    timestamps: true
});

orderSchema.pre('save', function (next) {
    if (this.isNew) {
        this.orderCode = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
