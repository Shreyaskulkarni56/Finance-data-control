const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All dashboard routes require login
router.use(authenticate);

// VIEWER cannot access dashboard — only ADMIN and ANALYST
router.get('/', authorize('ADMIN', 'ANALYST'), controller.getFullDashboard);
router.get('/summary', authorize('ADMIN', 'ANALYST'), controller.getSummary);
router.get('/categories', authorize('ADMIN', 'ANALYST'), controller.getCategoryTotals);
router.get('/trends', authorize('ADMIN', 'ANALYST'), controller.getMonthlyTrends);
router.get('/recent', authorize('ADMIN', 'ANALYST'), controller.getRecentActivity);

module.exports = router;