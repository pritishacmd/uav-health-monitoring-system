const express = require('express');

const router = express.Router();

const {
    getAllPredictions,
    getPredictionById,
    createPrediction,
    updatePrediction,
    deletePrediction,
    testAIService,
    runAIPrediction
} = require('../controllers/aiPredictionController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/service/health', authenticateToken, testAIService);

router.post('/predict', authenticateToken, runAIPrediction);

router.get('/', authenticateToken, getAllPredictions);

router.get('/:id', authenticateToken, getPredictionById);

router.post('/', authenticateToken, createPrediction);

router.put('/:id', authenticateToken, updatePrediction);

router.delete('/:id', authenticateToken, deletePrediction);

module.exports = router;