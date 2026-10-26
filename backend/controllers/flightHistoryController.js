const flightHistoryModel = require('../models/flightHistoryModel');

const getAllFlightHistory = async (req, res) => {
    try {
        const flights = await flightHistoryModel.getAllFlightHistory();

        res.json({
            status: 'OK',
            count: flights.length,
            data: flights
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching flight history'
        });
    }
};

const getFlightHistoryById = async (req, res) => {
    try {
        const flight = await flightHistoryModel.getFlightHistoryById(req.params.id);

        if (!flight) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Flight history record not found'
            });
        }

        res.json({
            status: 'OK',
            data: flight
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching flight history record'
        });
    }
};

const createFlightHistory = async (req, res) => {
    try {
        const flight = await flightHistoryModel.createFlightHistory(req.body);

        res.status(201).json({
            status: 'OK',
            message: 'Flight history record created successfully',
            data: flight
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error creating flight history record'
        });
    }
};

const updateFlightHistory = async (req, res) => {
    try {
        const flight = await flightHistoryModel.updateFlightHistory(
            req.params.id,
            req.body
        );

        if (!flight) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Flight history record not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Flight history record updated successfully',
            data: flight
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error updating flight history record'
        });
    }
};

const deleteFlightHistory = async (req, res) => {
    try {
        const flight = await flightHistoryModel.deleteFlightHistory(req.params.id);

        if (!flight) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Flight history record not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'Flight history record deleted successfully',
            data: flight
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error deleting flight history record'
        });
    }
};

module.exports = {
    getAllFlightHistory,
    getFlightHistoryById,
    createFlightHistory,
    updateFlightHistory,
    deleteFlightHistory
};