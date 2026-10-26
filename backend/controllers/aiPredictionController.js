const axios = require('axios');
const aiPredictionModel = require('../models/aiPredictionModel');

const AI_SERVICE_URL = 'http://localhost:8000';

const getAllPredictions = async (req, res) => {
    try {
        const predictions = await aiPredictionModel.getAllPredictions();

        res.json({
            status: 'OK',
            count: predictions.length,
            data: predictions
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching AI predictions'
        });
    }
};

const getPredictionById = async (req, res) => {
    try {
        const prediction = await aiPredictionModel.getPredictionById(
            req.params.id
        );

        if (!prediction) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'AI prediction not found'
            });
        }

        res.json({
            status: 'OK',
            data: prediction
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching AI prediction'
        });
    }
};

const createPrediction = async (req, res) => {
    try {
        const prediction = await aiPredictionModel.createPrediction(
            req.body
        );

        res.status(201).json({
            status: 'OK',
            message: 'AI prediction created successfully',
            data: prediction
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'ERROR',
            message: 'Error creating AI prediction'
        });
    }
};

const updatePrediction = async (req, res) => {
    try {
        const prediction = await aiPredictionModel.updatePrediction(
            req.params.id,
            req.body
        );

        if (!prediction) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'AI prediction not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'AI prediction updated successfully',
            data: prediction
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'ERROR',
            message: 'Error updating AI prediction'
        });
    }
};

const deletePrediction = async (req, res) => {
    try {
        const prediction = await aiPredictionModel.deletePrediction(
            req.params.id
        );

        if (!prediction) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'AI prediction not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'AI prediction deleted successfully',
            data: prediction
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'ERROR',
            message: 'Error deleting AI prediction'
        });
    }
};

const testAIService = async (req, res) => {
    try {
        const response = await axios.get(
            `${AI_SERVICE_URL}/health`
        );

        res.json({
            status: 'OK',
            message: 'AI service connected successfully',
            ai_service: response.data
        });
    } catch (error) {
        console.error(
            'AI service connection error:',
            error.message
        );

        res.status(503).json({
            status: 'ERROR',
            message: 'AI service is unavailable'
        });
    }
};

const runAIPrediction = async (req, res) => {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/api/ai/predict`,
            req.body
        );

        res.status(200).json({
            status: 'OK',
            message: 'AI prediction generated successfully',
            data: response.data
        });
    } catch (error) {
        console.error(
            'AI prediction service error:',
            error.response?.data || error.message
        );

        res.status(503).json({
            status: 'ERROR',
            message: 'AI prediction service is unavailable'
        });
    }
};

module.exports = {
    getAllPredictions,
    getPredictionById,
    createPrediction,
    updatePrediction,
    deletePrediction,
    testAIService,
    runAIPrediction
};