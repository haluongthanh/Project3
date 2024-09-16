const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const { logAction } = require('../utils/log')

exports.createProductReview = asyncHandler(async(req, res, next) => {
    const { rating, comment, productId } = req.body;
    req.body.addedBy = req.userInfo.userId;

    const review = {
        user: req.userInfo.userId,
        rating: Number(rating),
        comment,
        DateComent: new Date()
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.userInfo.userId.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.userInfo.userId.toString())
                (rev.rating = rating), (rev.comment = comment);
            return next(new ErrorHandler('bạn đã đánh giá sản phẩm'));
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;
    await logAction(
        'Create Review Product',
        'CREATE',
        'Product Review', 
        product._id,
        req.userInfo.userId,
        null, 
        req.body
    );
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
})

exports.getProductReviews = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.query.id).populate({ path: 'reviews', populate: ({ path: 'user', select: 'name avatar' }) });
    if (!product) return next(new ErrorHandler('Sản Phẩm Không Tồn Tại', 404));

    res.status(200).json({ success: true, reviews: product.reviews });
})

exports.deleteProductReview = asyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler('Sản Phẩm Không Tồn Tại', 404));
    req.body.updatedBy = req.userInfo.userId;

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    )
    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })
    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length;
    }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    const oldValue = product;

    await logAction(
        'Delete Review Product',
        'DELETE',
        'Product Review',
        product._id,
        req.userInfo.userId,
        oldValue,
        null
    );
    res.status(200).json({ success: true });
})