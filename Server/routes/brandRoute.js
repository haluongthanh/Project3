const express = require('express');
const { addBrand, getBrands, getBrandDetails, updateBrand, deleteBrand, getBrandsAuthorizeRole } = require('../controllers/brandController');

const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route('/brands')
    .post(isAuthenticated, authorizeRoles('admin',  'manage'), addBrand)
    .get(getBrands);

router.route('/brands/:id')
    .get(getBrandDetails)
    .put(isAuthenticated, authorizeRoles('admin',  'manage'), updateBrand)
    .delete(isAuthenticated, authorizeRoles('admin',  'manage'), deleteBrand);


router.route('/athorized/brands').get(isAuthenticated, authorizeRoles('admin',  'manage', ), getBrandsAuthorizeRole);
module.exports = router;