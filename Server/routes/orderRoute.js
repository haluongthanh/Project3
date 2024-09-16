const express = require('express');
const { CancelOrder, CheckTxnRef, newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder } = require('../controllers/orderController');
const axios = require('axios');

const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


router.route('/orders')
    .post(isAuthenticated, newOrder)
    .get(isAuthenticated, myOrders);

router.route('/cancelorder/:id').get(isAuthenticated, CancelOrder);

router.get('/provinces', async(req, res) => {
    try {
        const response = await axios.get('http://vapi.vnappmob.com/api/province');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch provinces' });
    }
});

router.route('/orders/:id')
    .get(isAuthenticated, getSingleOrder);

router.route('/authorized/orders')
    .get(isAuthenticated, authorizeRoles('admin','manage','staff'), getAllOrders);

router.route('/checkTxnRef/:txnRef').get(CheckTxnRef);

router.route('/authorized/orders/:id').delete(isAuthenticated, authorizeRoles('admin','manage','staff'), deleteOrder).put(isAuthenticated, authorizeRoles('admin',  'manage','staff'), updateOrder);

module.exports = router;