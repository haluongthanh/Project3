const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Errorhandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles, removeFile } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const path = require('path');
const { logAction } = require('../utils/log')
const mongoose = require('mongoose');
exports.addProduct = asyncHandler(async (req, res, next) => {
    const { roles } = req.userInfo;
    req.body.addedBy = req.userInfo.userId;

    let product = await Product.create(req.body);
    if (product) {
        const path = `products/${product._id}`;
        const productImages = await saveImages(req.files, path);
        const uniqueImages = [];
        const imageUrls = new Set();
        productImages.forEach((image) => {
            if (!imageUrls.has(image)) {
                imageUrls.add(image);
                uniqueImages.push({ url: image });
            }
        });

        product.images = uniqueImages;
        product.createdAt = Date.now();
        await logAction(
            'Create Product',
            'CREATE',
            'Product',
            product._id,
            req.userInfo.userId,
            null,
            req.body
        );
        product = await product.save();
        res.status(201).json({ success: true, product });
    }
});


exports.getProducts = asyncHandler(async (req, res, next) => {
    //product limit per page
    let resultPerPage;
    if (req.query.limit) {
        resultPerPage = parseInt(req.query.limit);
    } else {
        resultPerPage = 8;
    }

    //sort by ratings
    let sortBy;
    if (req.query.sort_by_ratings) {
        if (req.query.sort_by_ratings === 'true') {
            sortBy = { ratings: -1 };
        }
    } else {
        sortBy = {};
    }
    //sort by product added time
    if (req.query.sort_by_oldest) {
        if (req.query.sort_by_oldest === 'true') {
            sortBy = Object.assign(sortBy, { createdAt: +1 });
        }
    } else {
        sortBy = Object.assign(sortBy, { createdAt: -1 });
    }
    const filterConditions = { Status: 'active' };

    

    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(filterConditions).sort(sortBy), req.query).search().filter();


    const filteredApiFeature = new ApiFeatures(Product.find(filterConditions).sort(sortBy), req.query).search().filter();


    let filteredProduct = await filteredApiFeature.query;
    let filteredProductsCount = filteredProduct.length;
    // Get min and max price from filtered products
    const minPriceProduct = await Product.aggregate([
        { $match: filterConditions },
        { $match: { price: { $gte: 0 } } },
        { $match: { _id: { $in: filteredProduct.map(p => p._id) } } },
        { $sort: { price: 1 } },
        { $limit: 1 },
        { $project: { price: 1 } }
    ]);

    const maxPriceProduct = await Product.aggregate([
        { $match: filterConditions },
        { $match: { price: { $gte: 0 } } },
        { $match: { _id: { $in: filteredProduct.map(p => p._id) } } },
        { $sort: { price: -1 } },
        { $limit: 1 },
        { $project: { price: 1 } }
    ]);

    const minPrice = minPriceProduct.length > 0 ? minPriceProduct[0].price : 0;
    const maxPrice = maxPriceProduct.length > 0 ? maxPriceProduct[0].price : 0;

    apiFeature.pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
        price: {
            minPrice: minPrice,
            maxPrice: maxPrice
        }
    });
});

exports.getProductDetails = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
        .populate('brand', 'id title')
        .populate('category', 'id title')
        .populate({ path: 'reviews', populate: ({ path: 'user', select: 'name avatar' }) });

    if (!product) return next(new Errorhandler('Sản Phẩm không tồn tại', 404));
    res.status(200).json({ success: true, product });
})

exports.getProductsByAuthorizeRoles = asyncHandler(async (req, res, next) => {

    let resultPerPage = req.query.limit ? parseInt(req.query.limit) : 8;

    let sortBy = {};
    if (req.query.sort_by_ratings === 'true') {
        sortBy.ratings = -1;
    }

    if (req.query.sort_by_oldest) {
        if (req.query.sort_by_oldest === 'true') {
            sortBy = Object.assign(sortBy, { createdAt: +1 });
        }
    } else {
        sortBy = Object.assign(sortBy, { createdAt: -1 });
    }

    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find().sort(sortBy).populate('brand', 'title').populate('category', 'title'), req.query).search().filter();
    const filteredApiFeature = new ApiFeatures(Product.find().sort(sortBy).populate('brand', 'title').populate('category', 'title'), req.query).search().filter();

    let filteredProduct = await filteredApiFeature.query;
    let filteredProductsCount = filteredProduct.length;

    apiFeature.pagination(resultPerPage);
    const products = await apiFeature.query;

    const stockCounts = await Product.aggregate([
        {
            $group: {
                _id: null,
                inStock: { $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] } },
                outOfStock: { $sum: { $cond: [{ $lte: ["$stock", 0] }, 1, 0] } }
            }
        }
    ]);

    const inStockCount = stockCounts.length ? stockCounts[0].inStock : 0;
    const outOfStockCount = stockCounts.length ? stockCounts[0].outOfStock : 0;

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount,
        stock: {
            inStock: inStockCount,
            outOfStock: outOfStockCount
        }
    });
});


exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { roles } = req.userInfo;
    req.body.updatedBy = req.userInfo.userId;
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler('Sản Phẩm không tồn tại', 404));
    const oldValue = product;
    const oldImages = product.images;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
  
    if (req.files) {
        await logAction(
            'Update Product',
            'UPDATE',
            'Product',
            product._id,
            req.userInfo.userId,
            oldValue,
            req.body
        );
        const path = `products/${product._id}`;
        const newImages = await saveImages(req.files, path);

        const uniqueImages = [];
        const imageUrlsSet = new Set();
        [...oldImages.map(img => img.url), ...newImages].forEach((image) => {
            if (!imageUrlsSet.has(image)) {
                imageUrlsSet.add(image);
                uniqueImages.push({ url: image });
            }
        });

        product.images = uniqueImages;

        await product.save();

    }

    res.status(201).json({ success: true, product });
});



exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    req.body.updatedBy = req.userInfo.userId;
    const oldValue = product;

    if (!product) return next(new Errorhandler('Sản Phẩm không tồn tại', 404));
    const active = await Order.findOne({ orderItems: { $elemMatch: { product: req.params.id } } });
    if (active) return next(new Errorhandler('Sản phẩm được người dùng dặt hàng. Không thể xóa.', 404));
    if (product.Status != "pause") return next(new ErrorHandler('không thể xóa sản phẩm khi chưa tạm dừng'), 404);
    const path = `products/${product._id}`;
    const remove = removeFiles(path);
    if (remove) {

        await logAction(
            'Delete Product',
            'DELETE',
            'Product',
            product._id,
            req.userInfo.userId,
            oldValue,
            null
        );
        await product.remove();
        res.status(200).json({ success: true, message: 'Sản phẩm đã xóa.' });
    }
    return next(new Errorhandler('Not procceded.', 500));
})
exports.removeImage = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const imageId = req.params.imageId;
    req.body.updatedBy = req.userInfo.userId;

    const product = await Product.findById(productId);
    const oldValue = product;

    if (!product) {
        return next(new ErrorHandler('Sản Phẩm không tồn tại', 404));
    }

    const image = product.images.find(img => img._id.toString() === imageId);
    if (!image) {
        return next(new ErrorHandler('Image not found', 404));
    }

    const filePath = path.join(__dirname, '..', 'public', image.url);
    try {
        await removeFile(filePath);
    } catch (err) {
        return next(new ErrorHandler('Failed to remove image file', 500));
    }

    product.images = product.images.filter(img => img._id.toString() !== imageId);
    await logAction(
        'Delete Product Image',
        'DELETE',
        'Product',
        product._id,
        req.userInfo.userId,
        oldValue,
        null
    );
    await product.save();

    res.status(200).json({ success: true, message: 'Image removed successfully.' });
});