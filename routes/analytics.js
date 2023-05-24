// routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');
const { checkAuth, requireRole } = require('../middlewares/auth');

router.get('/:restaurantId', checkAuth, requireRole('restaurant'), analyticsController.getAllAnalytics);

module.exports = router;
