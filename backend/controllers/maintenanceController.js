const maintenanceModel = require('../models/maintenanceModel');

const getAllMaintenance = async (req, res) => {
    try {
        const maintenance = await maintenanceModel.getAllMaintenance();

        res.status(200).json({
            status: 'OK',
            count: maintenance.length,
            data: maintenance
        });
    } catch (error) {
        console.error('Error fetching maintenance:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch maintenance records'
        });
    }
};

const getMaintenanceById = async (req, res) => {
    try {
        const maintenanceId = parseInt(req.params.id);

        if (isNaN(maintenanceId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid maintenance ID'
            });
        }

        const maintenance = await maintenanceModel.getMaintenanceById(maintenanceId);

        if (!maintenance) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Maintenance record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: maintenance
        });
    } catch (error) {
        console.error('Error fetching maintenance:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch maintenance record'
        });
    }
};

const createMaintenance = async (req, res) => {
    try {
        const {
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes
        } = req.body;

        if (!uav_id || !maintenance_type) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id and maintenance_type are required'
            });
        }

        const maintenance = await maintenanceModel.createMaintenance({
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes
        });

        res.status(201).json({
            status: 'OK',
            message: 'Maintenance record created successfully',
            data: maintenance
        });
    } catch (error) {
        console.error('Error creating maintenance:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or user reference'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create maintenance record'
        });
    }
};

const updateMaintenance = async (req, res) => {
    try {
        const maintenanceId = parseInt(req.params.id);

        if (isNaN(maintenanceId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid maintenance ID'
            });
        }

        const existingMaintenance =
            await maintenanceModel.getMaintenanceById(maintenanceId);

        if (!existingMaintenance) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Maintenance record not found'
            });
        }

        const {
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes
        } = req.body;

        const maintenance = await maintenanceModel.updateMaintenance(
            maintenanceId,
            {
                uav_id,
                maintenance_type,
                description,
                scheduled_date,
                completed_date,
                performed_by,
                status,
                notes
            }
        );

        res.status(200).json({
            status: 'OK',
            message: 'Maintenance record updated successfully',
            data: maintenance
        });
    } catch (error) {
        console.error('Error updating maintenance:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV or user reference'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update maintenance record'
        });
    }
};

const deleteMaintenance = async (req, res) => {
    try {
        const maintenanceId = parseInt(req.params.id);

        if (isNaN(maintenanceId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid maintenance ID'
            });
        }

        const maintenance =
            await maintenanceModel.deleteMaintenance(maintenanceId);

        if (!maintenance) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Maintenance record not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Maintenance record deleted successfully',
            data: maintenance
        });
    } catch (error) {
        console.error('Error deleting maintenance:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete maintenance record'
        });
    }
};

module.exports = {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
};