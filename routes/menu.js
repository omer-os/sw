// routes/menu.js
const express = require('express');
const menuController = require('../controllers/menu');
const { menuValidationRules } = require('../validators/menuValidator');
const { checkAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', checkAuth, requireRole('restaurant'), menuController.getMenu);
router.get('/items', checkAuth, requireRole('restaurant'), menuController.getAllMenuItems);
router.get('/items/:itemId', checkAuth, requireRole('restaurant'), menuController.getMenuItem);
router.post('/', checkAuth, requireRole('restaurant'), menuValidationRules, menuController.createMenuItem);
router.put('/:itemId', checkAuth, requireRole('restaurant'), menuValidationRules, menuController.updateMenuItem);
router.delete('/:itemId', checkAuth, requireRole('restaurant'), menuController.deleteMenuItem);

module.exports = router;
