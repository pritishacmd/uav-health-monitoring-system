const express = require('express');

const router = express.Router();

const {
    getAllTelemetry,
    getTelemetryById,
    createTelemetry,
    updateTelemetry,
    deleteTelemetry
} = require('../controllers/telemetryController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllTelemetry);

router.get('/:id', authenticateToken, getTelemetryById);

router.post('/', authenticateToken, createTelemetry);

router.put('/:id', authenticateToken, updateTelemetry);

router.delete('/:id', authenticateToken, deleteTelemetry);

module.exports = router;