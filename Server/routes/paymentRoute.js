const express = require('express');
const { processPayment, sendStripePublishableKey, vnpay_ipn, vnpay_return } = require('../controllers/paymentController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.route('/create-payment-intent').post(isAuthenticated, processPayment)
router.route('/vnpay_ipn').get(isAuthenticated, vnpay_ipn)
router.route('/vnpay_return').get(isAuthenticated, vnpay_return)
router.route('/publishable-key').get(sendStripePublishableKey)

module.exports = router;