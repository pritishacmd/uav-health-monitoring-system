const express = require('express');

const router = express.Router();

const {
    getAllFlightHistory,
    getFlightHistoryById,
    createFlightHistory,
    updateFlightHistory,
    deleteFlightHistory
} = require('../controllers/flightHistoryController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllFlightHistory);

router.get('/:id', authenticateToken, getFlightHistoryById);

router.post('/', authenticateToken, createFlightHistory);

router.put('/:id', authenticateToken, updateFlightHistory);

router.delete('/:id', authenticateToken, deleteFlightHistory);

module.exports = router;