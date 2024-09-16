const express = require('express');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');
const { addBanner, getBanners, getBannerDetails, updateBanner, deleteBanner ,getBannersAuthorizeRole} = require('../controllers/bannerController');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');


router.route('/banners')
    .post(isAuthenticated,
        authorizeRoles('admin','manage','staff'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter, addBanner)
    .get(getBanners);


router.route('/banners/:id')
    .get(getBannerDetails)
    .put(isAuthenticated,
        authorizeRoles('admin', 'manage','staff'),
        fileUpload({ createParentPath: true }),
        fileExtLimiter(['.png', '.jpg', '.jpeg', '.webp']),
        fileSizeLimiter, updateBanner)
    .delete(isAuthenticated, authorizeRoles('admin', 'manage'), deleteBanner);

    router.route('/athorized/banners').get(isAuthenticated, authorizeRoles('admin',  'manage','staff'), getBannersAuthorizeRole);


module.exports = router;