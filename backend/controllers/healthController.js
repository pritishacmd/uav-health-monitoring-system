const healthModel = require('../models/healthModel');

const getAllHealth = async (req, res) => {
    try {
        const healthRecords = await healthModel.getAllHealthRecords();

        res.status(200).json({
            status: 'OK',
            count: healthRecords.length,
            data: healthRecords
        });
    } catch (error) {
        console.error('Error fetching health records:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch health records'
        });
    }
};

const getHealthById = async (req, res) => {
    try {
        const healthRecordId = parseInt(req.params.id);

        if (isNaN(healthRecordId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid health record ID'
            });
        }

        const healthRecord =
            await healthModel.getHealthRecordById(healthRecordId);

        if (!healthRecord) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Health record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: healthRecord
        });
    } catch (error) {
        console.error('Error fetching health record:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch health record'
        });
    }
};

const createHealth = async (req, res) => {
    try {
        const {
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        } = req.body;

        if (!uav_id) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id is required'
            });
        }

        const healthRecord = await healthModel.createHealthRecord({
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        });

        res.status(201).json({
            status: 'OK',
            message: 'Health record created successfully',
            data: healthRecord
        });
    } catch (error) {
        console.error('Error creating health record:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or telemetry reference'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create health record'
        });
    }
};

const updateHealth = async (req, res) => {
    try {
        const healthRecordId = parseInt(req.params.id);

        if (isNaN(healthRecordId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid health record ID'
            });
        }

        const existingRecord =
            await healthModel.getHealthRecordById(healthRecordId);

        if (!existingRecord) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Health record not found'
            });
        }

        const {
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        } = req.body;

        const healthRecord = await healthModel.updateHealthRecord(
            healthRecordId,
            {
                uav_id,
                telemetry_id,
                overall_health_score,
                battery_health_score,
                motor_health_score,
                sensor_health_score,
                communication_health_score,
                health_status,
                evaluated_at
            }
        );

        res.status(200).json({
            status: 'OK',
            message: 'Health record updated successfully',
            data: healthRecord
        });
    } catch (error) {
        console.error('Error updating health record:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or telemetry reference'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update health record'
        });
    }
};

const deleteHealth = async (req, res) => {
    try {
        const healthRecordId = parseInt(req.params.id);

        if (isNaN(healthRecordId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid health record ID'
            });
        }

        const healthRecord =
            await healthModel.deleteHealthRecord(healthRecordId);

        if (!healthRecord) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Health record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Health record deleted successfully',
            data: healthRecord
        });
    } catch (error) {
        console.error('Error deleting health record:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete health record'
        });
    }
};

module.exports = {
    getAllHealth,
    getHealthById,
    createHealth,
    updateHealth,
    deleteHealth
};