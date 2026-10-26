const express = require('express');

const router = express.Router();

const {
    getAllMissions,
    getMissionById,
    createMission,
    updateMission,
    deleteMission
} = require('../controllers/missionController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllMissions);

router.get('/:id', authenticateToken, getMissionById);

router.post('/', authenticateToken, createMission);

router.put('/:id', authenticateToken, updateMission);

router.delete('/:id', authenticateToken, deleteMission);

module.exports = router;