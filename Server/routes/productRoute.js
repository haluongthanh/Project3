const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

const { removeImage, addProduct, getProducts, getProductDetails, getProductsByAuthorizeRoles, updateProduct, deleteProduct } = require('../controllers/productController');

const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route('/products').post(isAuthenticated,
    authorizeRoles('admin', 'manage', 'staff'),
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
    fileSizeLimiter, addProduct).get(getProducts);

router.route('/products/:id').get(getProductDetails)
    .put(isAuthenticated,
        authorizeRoles('admin', 'manage', 'staff'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter, updateProduct).
    delete(isAuthenticated,
        authorizeRoles('admin', 'manage'),
        deleteProduct)
router.delete('/products/:id/image/:imageId', isAuthenticated, authorizeRoles('admin', 'manage', 'staff'),
    removeImage);


router.route('/athorized/products').get(isAuthenticated, authorizeRoles('admin', 'manage', 'staff'), getProductsByAuthorizeRoles)


module.exports = router;