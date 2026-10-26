const systemLogModel = require('../models/systemLogModel');

const getAllSystemLogs = async (req, res) => {
    try {
        const logs = await systemLogModel.getAllSystemLogs();

        res.json({
            status: 'OK',
            count: logs.length,
            data: logs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching system logs'
        });
    }
};

const getSystemLogById = async (req, res) => {
    try {
        const log = await systemLogModel.getSystemLogById(req.params.id);

        if (!log) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'System log not found'
            });
        }

        res.json({
            status: 'OK',
            data: log
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error fetching system log'
        });
    }
};

const createSystemLog = async (req, res) => {
    try {
        const log = await systemLogModel.createSystemLog(req.body);

        res.status(201).json({
            status: 'OK',
            message: 'System log created successfully',
            data: log
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error creating system log'
        });
    }
};

const updateSystemLog = async (req, res) => {
    try {
        const log = await systemLogModel.updateSystemLog(
            req.params.id,
            req.body
        );

        if (!log) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'System log not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'System log updated successfully',
            data: log
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error updating system log'
        });
    }
};

const deleteSystemLog = async (req, res) => {
    try {
        const log = await systemLogModel.deleteSystemLog(req.params.id);

        if (!log) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'System log not found'
            });
        }

        res.json({
            status: 'OK',
            message: 'System log deleted successfully',
            data: log
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Error deleting system log'
        });
    }
};

module.exports = {
    getAllSystemLogs,
    getSystemLogById,
    createSystemLog,
    updateSystemLog,
    deleteSystemLog
};