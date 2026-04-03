const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.use(authenticate);

// Only ADMIN can manage users
router.get('/', authorize('ADMIN'), controller.getAllUsers);
router.get('/:id', authorize('ADMIN'), controller.getUserById);
router.patch('/:id/role', authorize('ADMIN'), controller.updateUserRole);
router.patch('/:id/status', authorize('ADMIN'), controller.updateUserStatus);

module.exports = router;