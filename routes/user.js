// routes/user.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user');
const { createUserValidationRules } = require('../validators/userValidator');
const { checkAuth, requireRole } = require('../middlewares/auth');

router.post('/register', checkAuth, requireRole('admin'), createUserValidationRules, usersController.registerUser);
router.get('/', usersController.getAllUsers);
router.get('/:userId', checkAuth, requireRole('admin'), usersController.getUser);
router.post('/', checkAuth, requireRole('admin'), usersController.createUser);
router.put('/:userId', checkAuth, requireRole('admin'), usersController.updateUser);
router.delete('/:userId', checkAuth, requireRole('admin'), usersController.deleteUser);
// router.post('/googleSignIn', googleSignInValidationRules, userController.signInWithGoogle);

module.exports = router;
