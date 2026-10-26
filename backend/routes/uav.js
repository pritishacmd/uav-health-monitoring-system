const express = require('express');

const router = express.Router();

const {
    getAllUavs,
    getUavById,
    createUav,
    updateUav,
    deleteUav
} = require('../controllers/uavcontroller');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllUavs);

router.get('/:id', authenticateToken, getUavById);

router.post('/', authenticateToken, createUav);

router.put('/:id', authenticateToken, updateUav);

router.delete('/:id', authenticateToken, deleteUav);

module.exports = router;