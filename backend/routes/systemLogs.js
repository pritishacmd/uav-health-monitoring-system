const express = require('express');

const router = express.Router();

const {
    getAllSystemLogs,
    getSystemLogById,
    createSystemLog,
    updateSystemLog,
    deleteSystemLog
} = require('../controllers/systemLogController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllSystemLogs);

router.get('/:id', authenticateToken, getSystemLogById);

router.post('/', authenticateToken, createSystemLog);

router.put('/:id', authenticateToken, updateSystemLog);

router.delete('/:id', authenticateToken, deleteSystemLog);

module.exports = router;