const Brand = require('../models/brandModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { logAction } = require('../utils/log')
const ApiFeatures = require('../utils/apiFeatures');


exports.addBrand = asyncHandler(async (req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    const brand = await Brand.create(req.body);
    await logAction(
        'Create Brand',
        'CREATE',
        'Brand',
        brand._id,
        req.userInfo.userId,
        null,
        req.body
    );
    await brand.save()
    res.status(201).json({ success: true, brand });
})

exports.getBrands = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find({ Status: "active" });
    res.status(200).json({ success: true, brands });
})

exports.getBrandsAuthorizeRole = asyncHandler(async (req, res, next) => {
    let resultPerPage;
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

    if (req.query.limit) {
        resultPerPage = parseInt(req.query.limit);
    } else {
        resultPerPage = 8;
    }

    const brandCount = await Brand.countDocuments();

    const apiFeature = new ApiFeatures(Brand.find().sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(Brand.find().sort(sortBy), req.query)
        .search()
        .filter();

    let filteredBrands = await filteredApiFeature.query;
    let filteredBrandsCount = filteredBrands.length;

    apiFeature.pagination(resultPerPage);
    const brands = await apiFeature.query;

    res.status(200).json({
        success: true,
        brands,
        brandCount,
        resultPerPage,
        filteredBrandsCount,
    });
});


exports.getBrandDetails = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new ErrorHandler('Thương Hiệu Không Tồn Tại.', 404))
    res.status(200).json({ success: true, brand });
})

exports.updateBrand = asyncHandler(async (req, res, next) => {
    req.body.updatedBy = req.userInfo.userId;
    let brand = await Brand.findById(req.params.id);
    if (!brand) return next(new ErrorHandler('Thương Hiệu Không Tồn Tại.', 404))
    if (req.body.Status === "pause") {
        const active = await Product.findOne({ brand: req.params.id, Status: "active" });
        if (active) return next(new ErrorHandler('Thương hiệu đã được sử dụng. Không thể cập nhật.', 406));
    }
    const oldValue = brand;
    brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    await logAction(
        'Update Brand',
        'UPDATE',
        'Brand',
        brand._id,
        req.userInfo.userId,
        oldValue,
        req.body
    ); await brand.save()
    res.status(201).json({ success: true, brand });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
    req.body.updatedBy = req.userInfo.userId;

    let brand = await Brand.findById(req.params.id);
    if (!brand) return next(new ErrorHandler('Thương Hiệu Không Tồn Tại.', 404));
    const active = await Product.findOne({ brand: req.params.id });
    if (active) return next(new ErrorHandler('Thương hiệu đã được sử dụng. Không thể xóa.', 406));
    if (brand.Status != "pause") return next(new ErrorHandler('Thương hiệu không có trạng thái "tạm dừng". Không thể xóa', 406))

    const oldValue = brand;

    await logAction(
        'Delete Brand',
        'DELETE',
        'Brand',
        brand._id,
        req.userInfo.userId,
        oldValue,
        null
    ); 
    await brand.remove();

    res.status(200).json({ success: true });
});