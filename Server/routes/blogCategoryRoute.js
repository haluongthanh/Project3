const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

const { addBlogCategory, getBlogCategories, getBlogCategoryDetails, updateBlogCategory, deleteBlogCategory, getBlogCategoriesAuthorizeRole } = require('../controllers/blogCategoryController');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');


router.route('/blogcategories')
    .post(isAuthenticated,
        authorizeRoles('admin',  'manage'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter,
        addBlogCategory)
    .get(getBlogCategories);;


router.route('/blogcategories/:id')
    .get(getBlogCategoryDetails)
    .put(isAuthenticated,
        authorizeRoles('admin',  'manage'),
        authorizeRoles('admin',  'manage'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter,
        updateBlogCategory)
    .delete(isAuthenticated, authorizeRoles('admin',  'manage'), deleteBlogCategory);

router.route('/athorized/blogcategorys').get(isAuthenticated, authorizeRoles('admin',  'manage' ), getBlogCategoriesAuthorizeRole);


module.exports = router;