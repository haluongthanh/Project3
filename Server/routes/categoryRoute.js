const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const { addCategory, getCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');


router.route('/categories')
    .post(isAuthenticated,
        authorizeRoles('admin'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg']),
        fileSizeLimiter, addCategory)
    .get(getCategories);


router.route('/categories/:id')
    .get(getCategoryDetails)
    .put(isAuthenticated,
        authorizeRoles('admin'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg']),
        fileSizeLimiter, updateCategory)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteCategory);



module.exports = router;