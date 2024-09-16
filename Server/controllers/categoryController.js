const Category = require('../models/categoryModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { saveImages, removeFiles } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const { logAction } = require('../utils/log')

exports.addCategory = asyncHandler(async (req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    const category = await Category.create(req.body);

    category.discontinued = false;
    if (category) {
        const path = `CategoryImg/${category._id}`
        const imgCategory = await saveImages(req.files, path);
        category.CategoryImg = { url: imgCategory[0] }
        await logAction(
            'Create Category',
            'CREATE',
            'Category',
            category._id,
            req.userInfo.userId,
            null,
            req.body
        );
        await category.save();
        res.status(201).json({ success: true, category });
    }

})

exports.getCategories = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(Category.find({ Status: "active" }), req.query).search().filter();

    const categories = await apiFeature.query;
    res.status(200).json({ success: true, categories });
})
exports.getCategoriesAuthorizeRole = asyncHandler(async (req, res, next) => {
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

    const categoryCount = await Category.countDocuments();

    const apiFeature = new ApiFeatures(Category.find().sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(Category.find().sort(sortBy), req.query)
        .search()
        .filter();

    let filteredCatrgories = await filteredApiFeature.query;
    let filteredCategiriesCount = filteredCatrgories.length;

    apiFeature.pagination(resultPerPage);
    const categories = await apiFeature.query;

    res.status(200).json({
        success: true,
        categories,
        categoryCount,
        resultPerPage,
        filteredCategiriesCount,
    });
});

exports.getCategoryDetails = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler('Danh Mục Không Tồn Tại.', 404))
    res.status(200).json({ success: true, category });
})

exports.updateCategory = asyncHandler(async (req, res, next) => {

    req.body.updatedBy = req.userInfo.userId;
    const parent_category = req.body.parent_category;

    let category = await Category.findById(req.params.id);

    if (!category) return next(new ErrorHandler('Danh Mục Không Tồn Tại.', 404))

    if (req.body.Status === "pause") {
        const active = await Product.findOne({ category: req.params.id, Status: "active" });
        if (active) return next(new ErrorHandler('Danh mục đã được sử dụng. Không thể cập nhật.', 406));
    }
    const oldValue = category;
    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });


    if (category) {
        await logAction(
            'Update Category',
            'UPDATE',
            'Category',
            category._id,
            req.userInfo.userId,
            oldValue,
            req.body
        );
        if (req.files) {
            const path = `CategoryImg/${category._id}`;
            const remove = removeFiles(path);
            if (remove) {
                const imgCategory = await saveImages(req.files, path);
                category.CategoryImg = { url: imgCategory[0] };
                await logAction(
                    'Update Category',
                    'UPDATE',
                    'Category',
                    category._id,
                    req.userInfo.userId,
                    oldValue,
                    req.body
                );

                await category.save();
            } else {
                return next(new ErrorHandler('Not procceded.', 500))
            }
        }
    }
    res.status(201).json({ success: true, category });
});


exports.deleteCategory = asyncHandler(async (req, res, next) => {
    req.body.updatedBy = req.userInfo.userId;

    let category = await Category.findById(req.params.id);
    if (!category) return next(new ErrorHandler('Danh Mục Không Tồn Tại.', 404))
    const active = await Product.findOne({ category: req.params.id });
    if (active) return next(new ErrorHandler('Danh mục đã được sử dụng. Không thể xóa', 406));
    if (category.Status != "pause") return next(new ErrorHandler('Danh mục không có trạng thái "tạm dừng". Không thể xóa'));
    const oldValue = category;

    await logAction(
        'Delete Category',
        'DELETE',
        'Category',
        category._id,
        req.userInfo.userId,
        oldValue,
        null
    );
    const path = `CategoryImg/${category._id}`;
    removeFiles(path);

    await category.remove();
    res.status(200).json({ success: true, messge: 'Category deleted' });
});