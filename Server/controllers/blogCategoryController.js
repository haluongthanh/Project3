const BlogCategory = require('../models/blogCategoryModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const { saveImages, removeFiles } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const { logAction } = require('../utils/log')

exports.addBlogCategory = asyncHandler(async (req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    const blogCategory = await BlogCategory.create(req.body);
    if (blogCategory) {
        const path = `BlogCategoryImg/${blogCategory._id}`
        const img = await saveImages(req.files, path);
        blogCategory.blogCategoryImg = { url: img[0] }
        await logAction(
            'Create Blog Category',
            'CREATE',
            'BlogCateory',
            blogCategory._id,
            req.userInfo.userId,
            null,
            req.body
        );

        await blogCategory.save();

        res.status(201).json({ success: true, blogCategory });
    }
})

exports.getBlogCategories = asyncHandler(async (req, res, next) => {
    const blogCategorys = await BlogCategory.find({ Status: "active" });
    res.status(200).json({ success: true, blogCategorys });
})
exports.getBlogCategoriesAuthorizeRole = asyncHandler(async (req, res, next) => {
    let resultPerPage;
    if (req.query.limit) {
        resultPerPage = parseInt(req.query.limit);
    } else {
        resultPerPage = 8;
    }

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

    const blogCategoryCount = await BlogCategory.countDocuments();

    const apiFeature = new ApiFeatures(BlogCategory.find().sort(sortBy), req.query)
        .search()
        .filter();

    const filteredApiFeature = new ApiFeatures(BlogCategory.find().sort(sortBy), req.query)
        .search()
        .filter();

    let filteredBlogCategories = await filteredApiFeature.query;
    let filteredBlogCategoriesCount = filteredBlogCategories.length;

    apiFeature.pagination(resultPerPage);
    const blogCategories = await apiFeature.query;

    res.status(200).json({
        success: true,
        blogCategories,
        blogCategoryCount,
        resultPerPage,
        filteredBlogCategoriesCount,
    });

})

exports.getBlogCategoryDetails = asyncHandler(async (req, res, next) => {
    const blogCategory = await BlogCategory.findById(req.params.id);
    if (!blogCategory) return next(new ErrorHandler(' Danh Mục Tin Không Tồn Tại.', 404))
    res.status(200).json({ success: true, blogCategory });
})

exports.updateBlogCategory = asyncHandler(async (req, res, next) => {
    try {
        req.body.updatedBy = req.userInfo.userId;

        let blogCategory = await BlogCategory.findById(req.params.id);

        if (!blogCategory) return next(new ErrorHandler('Danh Mục Tin Không Tồn Tại.', 404));
        if (req.body.Status === "pause") {
            const active = await Blog.findOne({blogCategory: req.params.id, Status: "active" });
            if (active) return next(new ErrorHandler('Danh Mục Tin đã được sử dụng. Không thể cập nhật', 406));
        }

        const oldValue = blogCategory;
        blogCategory = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

        if (blogCategory) {
            await logAction(
                'Update Blog Category',
                'UPDATE',
                'BlogCategory',
                blogCategory._id,
                req.userInfo.userId,
                oldValue,
                req.body
            );
            if (req.files) {
                const path = `BlogCategoryImg/${blogCategory._id}`;
                const remove = removeFiles(path);
                if (remove) {
                    const img = await saveImages(req.files, path);
                    blogCategory.blogCategoryImg = { url: img[0] };

                    await blogCategory.save();

                } else {
                    return next(new ErrorHandler('Not proceeded.', 500));
                }
            }
        }

        res.status(201).json({ success: true, blogCategory });
    } catch (error) {
        console.error("Error during blog category update:", error);
        next(error);
    }
});



exports.deleteBlogCategory = asyncHandler(async (req, res, next) => {
    let blogCategory = await BlogCategory.findById(req.params.id);
    req.body.updatedBy = req.userInfo.userId;
    if (!blogCategory) return next(new ErrorHandler('Danh Mục Tin Không Tồn Tại.', 404))
    const active = await Blog.findOne({ blog: req.params.id });
    if (active) return next(new ErrorHandler('Danh Mục Tin đã được sử dụng. Không thể xóa', 406));
    if (blogCategory.Status != "pause") return next(new ErrorHandler('Danh Mục Tin không có trạng thái "tạm dừng". Không thể xóa'));
    const oldValue = blogCategory;

    await logAction(
        'Delete Blog Category',
        'DELETE',
        'BlogCategory',
        blogCategory._id,
        req.userInfo.userId,
        oldValue,
        null
    );
    const path = `BlogCategoryImg/${blogCategory._id}`;
    removeFiles(path);
    
    await blogCategory.remove();
    res.status(200).json({ success: true, messge: 'Danh Mục Tin Dẫ Xóa' });
});