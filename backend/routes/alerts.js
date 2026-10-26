const express = require('express');

const router = express.Router();

const {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert
} = require('../controllers/alertController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllAlerts);

router.get('/:id', authenticateToken, getAlertById);

router.post('/', authenticateToken, createAlert);

router.put('/:id', authenticateToken, updateAlert);

router.delete('/:id', authenticateToken, deleteAlert);

module.exports = router;