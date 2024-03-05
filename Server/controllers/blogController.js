const Blog = require('../models/blogModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const { saveImages, removeFiles } = require('../utils/processImages');

exports.addBlog = asyncHandler(async(req, res, next) => {
    req.body.addedBy = req.userInfo.userId;
    const blog = await Blog.create(req.body);
    if (Blog) {
        const path = `BlogImg/${blog._id}`
        const imgBlog = await saveImages(req.files, path);
        blog.ImageURL = { url: imgBlog[0] }
        await blog.save();
        res.status(201).json({ success: true, blog });
    }
});

exports.getBlogs = asyncHandler(async(req, res, next) => {
    const blogs = await Blog.find();
    res.status(200).json({ success: true, blogs });
})

exports.getBlogDetails = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return next(new ErrorHandler('Blog not found.', 404))
    res.status(200).json({ success: true, blog });
})

exports.updateBlog = asyncHandler(async(req, res, next) => {

    req.body.updatedBy = req.userInfo.userId;
    const parent_Blog = req.body.parent_Blog;

    let blog = await Blog.findById(req.params.id);

    if (!blog) return next(new ErrorHandler('Blog not found.', 404))

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });


    if (blog) {
        if (req.files) {
            const path = `BlogImg/${blog._id}`;
            const remove = removeFiles(path);
            if (remove) {
                const imgBlog = await saveImages(req.files, path);
                blog.ImageURL = { url: imgBlog[0] };
                await blog.save();
            } else {
                return next(new ErrorHandler('Not procceded.', 500))
            }
        }
    }
    res.status(201).json({ success: true, blog });
});


exports.deleteBlog = asyncHandler(async(req, res, next) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return next(new ErrorHandler('Blog not found.', 404))
    const active = await Product.findOne({ blog: req.params.id });
    if (active) return next(new ErrorHandler('Blog is used.Could not deleted.', 406));
    if (banner.bannerStatus != "false") return next(new ErrorHandler('Blog no status pause'))
    const path = `BllogImg/${blog._id}`;
    removeFiles(path);

    await blog.remove();
    res.status(200).json({ success: true, messge: 'Blog deleted' });
});