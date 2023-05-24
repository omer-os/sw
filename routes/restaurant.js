// routes/restaurant.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');
const { checkAuth, requireRole } = require('../middlewares/auth');
const restaurantValidator = require('../validators/restaurantValidator');

router.post('/', restaurantValidator.createRestaurantValidation, restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.put('/:id', checkAuth, requireRole('restaurant'), restaurantValidator.createRestaurantValidation, restaurantController.updateRestaurant);
router.delete('/:id', checkAuth, requireRole('restaurant'), restaurantValidator.getRestaurantValidation, restaurantController.deleteRestaurant);

module.exports = router;
