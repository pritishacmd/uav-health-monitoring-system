const uavModel = require('../models/uavModel');

const getAllUavs = async (req, res) => {
    try {
        const uavs = await uavModel.getAllUavs();

        res.status(200).json({
            status: 'OK',
            count: uavs.length,
            data: uavs
        });
    } catch (error) {
        console.error('Error fetching UAVs:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch UAVs'
        });
    }
};

const getUavById = async (req, res) => {
    try {
        const uavId = parseInt(req.params.id);

        if (isNaN(uavId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV ID'
            });
        }

        const uav = await uavModel.getUavById(uavId);

        if (!uav) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'UAV not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: uav
        });
    } catch (error) {
        console.error('Error fetching UAV:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch UAV'
        });
    }
};

const createUav = async (req, res) => {
    try {
        const {
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date
        } = req.body;

        if (!uav_name || !model || !serial_number) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_name, model and serial_number are required'
            });
        }

        const uav = await uavModel.createUav({
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date
        });

        res.status(201).json({
            status: 'OK',
            message: 'UAV created successfully',
            data: uav
        });
    } catch (error) {
        console.error('Error creating UAV:', error.message);

        if (error.code === '23505') {
            return res.status(409).json({
                status: 'ERROR',
                message: 'Serial number already exists'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create UAV'
        });
    }
};

const updateUav = async (req, res) => {
    try {
        const uavId = parseInt(req.params.id);

        if (isNaN(uavId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV ID'
            });
        }

        const existingUav = await uavModel.getUavById(uavId);

        if (!existingUav) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'UAV not found'
            });
        }

        const {
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date
        } = req.body;

        const uav = await uavModel.updateUav(uavId, {
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date
        });

        res.status(200).json({
            status: 'OK',
            message: 'UAV updated successfully',
            data: uav
        });
    } catch (error) {
        console.error('Error updating UAV:', error.message);

        if (error.code === '23505') {
            return res.status(409).json({
                status: 'ERROR',
                message: 'Serial number already exists'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update UAV'
        });
    }
};

const deleteUav = async (req, res) => {
    try {
        const uavId = parseInt(req.params.id);

        if (isNaN(uavId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV ID'
            });
        }

        const uav = await uavModel.deleteUav(uavId);

        if (!uav) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'UAV not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'UAV deleted successfully',
            data: uav
        });
    } catch (error) {
        console.error('Error deleting UAV:', error.message);

        if (error.code === '23503') {
            return res.status(409).json({
                status: 'ERROR',
                message: 'Cannot delete UAV because it is referenced by existing records'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete UAV'
        });
    }
};

module.exports = {
    getAllUavs,
    getUavById,
    createUav,
    updateUav,
    deleteUav
};