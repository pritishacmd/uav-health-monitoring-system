const alertModel = require('../models/alertModel');

const getAllAlerts = async (req, res) => {
    try {
        const alerts = await alertModel.getAllAlerts();

        res.status(200).json({
            status: 'OK',
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        console.error('Error fetching alerts:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch alerts'
        });
    }
};

const getAlertById = async (req, res) => {
    try {
        const alertId = parseInt(req.params.id);

        if (isNaN(alertId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid alert ID'
            });
        }

        const alert = await alertModel.getAlertById(alertId);

        if (!alert) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: alert
        });
    } catch (error) {
        console.error('Error fetching alert:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch alert'
        });
    }
};

const createAlert = async (req, res) => {
    try {
        const {
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            resolved_at
        } = req.body;

        if (!uav_id || !alert_type || !severity || !message) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id, alert_type, severity and message are required'
            });
        }

        const alert = await alertModel.createAlert({
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            resolved_at
        });

        res.status(201).json({
            status: 'OK',
            message: 'Alert created successfully',
            data: alert
        });
    } catch (error) {
        console.error('Error creating alert:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or prediction ID'
            });
        }

        if (error.code === '23514') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid severity or alert status'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create alert'
        });
    }
};

const updateAlert = async (req, res) => {
    try {
        const alertId = parseInt(req.params.id);

        if (isNaN(alertId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid alert ID'
            });
        }

        const existingAlert = await alertModel.getAlertById(alertId);

        if (!existingAlert) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Alert not found'
            });
        }

        const {
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            resolved_at
        } = req.body;

        const alert = await alertModel.updateAlert(alertId, {
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            resolved_at
        });

        res.status(200).json({
            status: 'OK',
            message: 'Alert updated successfully',
            data: alert
        });
    } catch (error) {
        console.error('Error updating alert:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or prediction ID'
            });
        }

        if (error.code === '23514') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid severity or alert status'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update alert'
        });
    }
};

const deleteAlert = async (req, res) => {
    try {
        const alertId = parseInt(req.params.id);

        if (isNaN(alertId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid alert ID'
            });
        }

        const alert = await alertModel.deleteAlert(alertId);

        if (!alert) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Alert deleted successfully',
            data: alert
        });
    } catch (error) {
        console.error('Error deleting alert:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete alert'
        });
    }
};

module.exports = {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert
};