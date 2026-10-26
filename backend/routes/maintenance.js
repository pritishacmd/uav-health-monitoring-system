const express = require('express');

const router = express.Router();

const {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
} = require('../controllers/maintenanceController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllMaintenance);

router.get('/:id', authenticateToken, getMaintenanceById);

router.post('/', authenticateToken, createMaintenance);

router.put('/:id', authenticateToken, updateMaintenance);

router.delete('/:id', authenticateToken, deleteMaintenance);

module.exports = router;