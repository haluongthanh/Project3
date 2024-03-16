const express = require('express');
const { addBrand, getBrands, getBrandDetails, updateBrand, deleteBrand, getBrandsAuthorizeRole } = require('../controllers/brandController');

const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route('/brands')
    .post(isAuthenticated, authorizeRoles('admin'), addBrand)
    .get(getBrands);

router.route('/brands/:id')
    .get(getBrandDetails)
    .put(isAuthenticated, authorizeRoles('admin'), updateBrand)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteBrand);


router.route('/athorized/brands').get(isAuthenticated, authorizeRoles('admin', 'seller'), getBrandsAuthorizeRole);
module.exports = router;