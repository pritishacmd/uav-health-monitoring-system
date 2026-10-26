const telemetryModel = require('../models/telemetryModel');

const getAllTelemetry = async (req, res) => {
    try {
        const telemetry = await telemetryModel.getAllTelemetry();

        res.status(200).json({
            status: 'OK',
            count: telemetry.length,
            data: telemetry
        });
    } catch (error) {
        console.error('Error fetching telemetry:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch telemetry'
        });
    }
};

const getTelemetryById = async (req, res) => {
    try {
        const telemetryId = parseInt(req.params.id);

        if (isNaN(telemetryId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid telemetry ID'
            });
        }

        const telemetry = await telemetryModel.getTelemetryById(telemetryId);

        if (!telemetry) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Telemetry record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: telemetry
        });
    } catch (error) {
        console.error('Error fetching telemetry:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch telemetry'
        });
    }
};

const createTelemetry = async (req, res) => {
    try {
        const {
            uav_id,
            mission_id,
            recorded_at,
            latitude,
            longitude,
            altitude,
            speed,
            battery_percentage,
            battery_voltage,
            battery_current,
            temperature,
            pressure,
            humidity,
            vibration,
            motor_1_rpm,
            motor_2_rpm,
            motor_3_rpm,
            motor_4_rpm,
            gps_signal,
            communication_signal,
            flight_mode
        } = req.body;

        if (!uav_id) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id is required'
            });
        }

        const telemetry = await telemetryModel.createTelemetry({
            uav_id,
            mission_id,
            recorded_at,
            latitude,
            longitude,
            altitude,
            speed,
            battery_percentage,
            battery_voltage,
            battery_current,
            temperature,
            pressure,
            humidity,
            vibration,
            motor_1_rpm,
            motor_2_rpm,
            motor_3_rpm,
            motor_4_rpm,
            gps_signal,
            communication_signal,
            flight_mode
        });

        res.status(201).json({
            status: 'OK',
            message: 'Telemetry created successfully',
            data: telemetry
        });
    } catch (error) {
        console.error('Error creating telemetry:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or mission ID'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create telemetry'
        });
    }
};

const updateTelemetry = async (req, res) => {
    try {
        const telemetryId = parseInt(req.params.id);

        if (isNaN(telemetryId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid telemetry ID'
            });
        }

        const existingTelemetry =
            await telemetryModel.getTelemetryById(telemetryId);

        if (!existingTelemetry) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Telemetry record not found'
            });
        }

        const telemetry = await telemetryModel.updateTelemetry(
            telemetryId,
            req.body
        );

        res.status(200).json({
            status: 'OK',
            message: 'Telemetry updated successfully',
            data: telemetry
        });
    } catch (error) {
        console.error('Error updating telemetry:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or mission ID'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update telemetry'
        });
    }
};

const deleteTelemetry = async (req, res) => {
    try {
        const telemetryId = parseInt(req.params.id);

        if (isNaN(telemetryId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid telemetry ID'
            });
        }

        const telemetry =
            await telemetryModel.deleteTelemetry(telemetryId);

        if (!telemetry) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Telemetry record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Telemetry deleted successfully',
            data: telemetry
        });
    } catch (error) {
        console.error('Error deleting telemetry:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete telemetry'
        });
    }
};

module.exports = {
    getAllTelemetry,
    getTelemetryById,
    createTelemetry,
    updateTelemetry,
    deleteTelemetry
};