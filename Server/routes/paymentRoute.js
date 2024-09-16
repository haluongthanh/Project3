const express = require('express');
const { processPayment, vnpay_ipn, vnpay_return } = require('../controllers/paymentController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.route('/create-payment-intent').post(processPayment)
    // router.route('/vnpay_ipn').get(isAuthenticated, vnpay_ipn)
router.route('/vnpay_return').get(vnpay_return)


module.exports = router;