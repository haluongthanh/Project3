const Blog = require('../models/blogModel');
const BlogCategory = require('../models/blogCategoryModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles } = require('../utils/processImages');
const ApiFeatures = require('../utils/apiFeatures');
const { logAction } = require('../utils/log')

exports.addBlog = asyncHandler(async (req, res, next) => {
    try {
        req.body.addedBy = req.userInfo.userId;
        const blog = await Blog.create(req.body);
        if (blog) {
            const path = `BlogImg/${blog._id}`;
            const imgBlog = await saveImages(req.files, path);
            blog.ImageURL = { url: imgBlog[0] };
            await logAction(
                'Create Blog',
                'CREATE',
                'Blog', 
                blog._id,
                req.userInfo.userId,
                null, 
                req.body
            );
            await blog.save();
            res.status(201).json({ success: true, blog });
        }
    } catch (error) {
        next(error);
    }
});

exports.getBlogs = asyncHandler(async(req, res, next) => {

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

    const blogCount = await Blog.countDocuments();
    const apiFeature = new ApiFeatures(Blog.find({ Status: "active" }).sort(sortBy), req.query).search().filter();

    const filteredApiFeature = new ApiFeatures(Blog.find({ Status: "active" }).sort(sortBy), req.query).search().filter();


    let filteredBlog = await filteredApiFeature.query;
    let filteredBlogsCount = filteredBlog.length;

    apiFeature.pagination(resultPerPage);
    const blogs = await apiFeature.query;

    res.status(200).json({
        success: true,
        blogs,
        blogCount,
        resultPerPage,
        filteredBlogsCount,
    });
})

exports.getBlogsAuthorizeRole = asyncHandler(async(req, res, next) => {
    let resultPerPage;
    let sortBy = { createdAt: -1 };

    if (req.query.limit) {
        resultPerPage = parseInt(req.query.limit);
    } else {
        resultPerPage = 8;
    }

    const blogCount = await Blog.countDocuments();
    const apiFeature = new ApiFeatures(Blog.find().sort(sortBy).populate('blogCategory', 'title'), req.query).search().filter();

    const filteredApiFeature = new ApiFeatures(Blog.find().sort(sortBy).populate('blogCategory', 'title'), req.query).search().filter();


    let filteredBlog = await filteredApiFeature.query;
    let filteredBlogsCount = filteredBlog.length;

    apiFeature.pagination(resultPerPage);
    const blogs = await apiFeature.query;

    res.status(200).json({
        success: true,
        blogs,
        blogCount,
        resultPerPage,
        filteredBlogsCount,
    });

})

exports.getBlogDetails = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findById(req.params.id)
        .populate('blogCategory', 'id title');
    if (!blog) return next(new ErrorHandler('Tin Khôn Tồn Tại.', 404))
    res.status(200).json({ success: true, blog });
})

exports.updateBlog = asyncHandler(async (req, res, next) => {
    try {
        req.body.updatedBy = req.userInfo.userId;

        const blog = await Blog.findById(req.params.id);
        if (!blog) return next(new ErrorHandler('Tin Khôn Tồn Tại.', 404));

        const oldValue = blog;
        let updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
       
        if (updatedBlog) {
            await logAction(
                'Update Blog',
                'UPDATE',
                'Blog',
                blog._id,
                req.userInfo.userId,
                oldValue,
                req.body
            );
            if (req.files) {
                const path = `BlogImg/${blog._id}`;
                
                const remove = await removeFiles(path); 
                if (remove) {
                    const imgBlog = await saveImages(req.files, path);
                    blog.ImageURL = { url: imgBlog[0] };
                    await blog.save();
                } else {
                    return next(new ErrorHandler('Not proceeded.', 500));
                }
            }

            res.status(200).json({ success: true, blog: blog });
        }
    } catch (error) {
        next(error);
    }
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return next(new ErrorHandler('Tin Khôn Tồn Tại.', 404));

        if (blog.Status !== 'pause') return next(new ErrorHandler('Tin không có trạng thái "tạm dừng". Không thể xóa.', 400));

        const oldValue = blog;

        await logAction(
            'Delete Blog',
            'DELETE',
            'Blog',
            blog._id,
            req.userInfo.userId,
            oldValue, 
            null      
        );
        const path = `BlogImg/${blog._id}`;
        await removeFiles(path); 


        await blog.remove();

        res.status(200).json({ success: true, message: 'Tin Dẫ Xóa' });
    } catch (error) {
        next(error);
    }
});