const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const { addBlog, getBlogs, getBlogDetails, updateBlog, deleteBlog, getBlogsAuthorizeRole } = require('../controllers/blogController');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');


router.route('/blogs')
    .post(isAuthenticated,
        authorizeRoles('admin'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter, addBlog)
    .get(getBlogs);


router.route('/blogs/:id')
    .get(getBlogDetails)
    .put(isAuthenticated,
        authorizeRoles('admin'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter, updateBlog)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteBlog);

router.route('/athorized/blogs').get(isAuthenticated, authorizeRoles('admin', 'seller'), getBlogsAuthorizeRole);

module.exports = router;