const dashboardService = require('../services/dashboard.service');

const getSummary = async (req, res, next) => {
    try {
        const data = await dashboardService.getSummary(req.user.id, req.user.role);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const getCategoryTotals = async (req, res, next) => {
    try {
        const data = await dashboardService.getCategoryTotals(req.user.id, req.user.role);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const getMonthlyTrends = async (req, res, next) => {
    try {
        const data = await dashboardService.getMonthlyTrends(req.user.id, req.user.role);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const getRecentActivity = async (req, res, next) => {
    try {
        const data = await dashboardService.getRecentActivity(req.user.id, req.user.role);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const getFullDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getFullDashboard(req.user.id, req.user.role);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity, getFullDashboard };