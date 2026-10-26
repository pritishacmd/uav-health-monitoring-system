const express = require('express');

const router = express.Router();

const {
    getAllHealth,
    getHealthById,
    createHealth,
    updateHealth,
    deleteHealth
} = require('../controllers/healthController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllHealth);

router.get('/:id', authenticateToken, getHealthById);

router.post('/', authenticateToken, createHealth);

router.put('/:id', authenticateToken, updateHealth);

router.delete('/:id', authenticateToken, deleteHealth);

module.exports = router;