const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All transaction routes require login
router.use(authenticate);

// GET    /api/transactions         → all roles can view
// POST   /api/transactions         → ADMIN and ANALYST only
// GET    /api/transactions/:id     → all roles (service handles ownership check)
// PUT    /api/transactions/:id     → ADMIN and ANALYST only
// DELETE /api/transactions/:id     → ADMIN only

router.get('/', authorize('ADMIN', 'ANALYST', 'VIEWER'), controller.getTransactions);
router.post('/', authorize('ADMIN', 'ANALYST'), controller.createTransaction);
router.get('/:id', authorize('ADMIN', 'ANALYST', 'VIEWER'), controller.getTransactionById);
router.put('/:id', authorize('ADMIN', 'ANALYST'), controller.updateTransaction);
router.delete('/:id', authorize('ADMIN'), controller.deleteTransaction);

module.exports = router;