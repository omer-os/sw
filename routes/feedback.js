// routes/feedback.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');
const { checkAuth, requireRole } = require('../middlewares/auth');

router.post('/:restaurantId', feedbackController.createFeedback);
router.get('/:restaurantId', checkAuth, requireRole('restaurant'), feedbackController.getFeedbacks);

module.exports = router;
