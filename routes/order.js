// routes/order.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/order');
const { checkAuth, requireRole } = require('../middlewares/auth');

router.post('/', checkAuth, requireRole('restaurant'), ordersController.placeOrder);
router.get('/:restaurantId', checkAuth, requireRole('restaurant'), ordersController.getAllOrders);
router.get('/order/:orderId', checkAuth, requireRole('restaurant'), ordersController.getOrder);
router.put('/:orderId', checkAuth, requireRole('restaurant'), ordersController.updateOrder );
router.delete('/:orderId', checkAuth, requireRole('restaurant'), ordersController.deleteOrder);

module.exports = router;
