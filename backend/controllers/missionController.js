const missionModel = require('../models/missionModel');

const getAllMissions = async (req, res) => {
    try {
        const missions = await missionModel.getAllMissions();

        res.status(200).json({
            status: 'OK',
            count: missions.length,
            data: missions
        });
    } catch (error) {
        console.error('Error fetching missions:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch missions'
        });
    }
};

const getMissionById = async (req, res) => {
    try {
        const missionId = parseInt(req.params.id);

        if (isNaN(missionId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid mission ID'
            });
        }

        const mission = await missionModel.getMissionById(missionId);

        if (!mission) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Mission not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            data: mission
        });
    } catch (error) {
        console.error('Error fetching mission:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to fetch mission'
        });
    }
};

const createMission = async (req, res) => {
    try {
        const {
            uav_id,
            created_by,
            mission_name,
            description,
            start_time,
            end_time,
            start_latitude,
            start_longitude,
            destination_latitude,
            destination_longitude,
            status
        } = req.body;

        if (!uav_id || !created_by || !mission_name) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id, created_by and mission_name are required'
            });
        }

        const mission = await missionModel.createMission({
            uav_id,
            created_by,
            mission_name,
            description,
            start_time,
            end_time,
            start_latitude,
            start_longitude,
            destination_latitude,
            destination_longitude,
            status
        });

        res.status(201).json({
            status: 'OK',
            message: 'Mission created successfully',
            data: mission
        });
    } catch (error) {
        console.error('Error creating mission:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV ID or user ID'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to create mission'
        });
    }
};

const updateMission = async (req, res) => {
    try {
        const missionId = parseInt(req.params.id);

        if (isNaN(missionId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid mission ID'
            });
        }

        const existingMission =
            await missionModel.getMissionById(missionId);

        if (!existingMission) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Mission not found'
            });
        }

        const {
            uav_id,
            mission_name,
            description,
            start_time,
            end_time,
            start_latitude,
            start_longitude,
            destination_latitude,
            destination_longitude,
            status
        } = req.body;

        if (!uav_id || !mission_name) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'uav_id and mission_name are required'
            });
        }

        const mission = await missionModel.updateMission(
            missionId,
            {
                uav_id,
                created_by: existingMission.created_by,
                mission_name,
                description,
                start_time,
                end_time,
                start_latitude,
                start_longitude,
                destination_latitude,
                destination_longitude,
                status
            }
        );

        res.status(200).json({
            status: 'OK',
            message: 'Mission updated successfully',
            data: mission
        });
    } catch (error) {
        console.error('Error updating mission:', error.message);

        if (error.code === '23503') {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid UAV ID or user ID'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to update mission'
        });
    }
};

const deleteMission = async (req, res) => {
    try {
        const missionId = parseInt(req.params.id);

        if (isNaN(missionId)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Invalid mission ID'
            });
        }

        const mission =
            await missionModel.deleteMission(missionId);

        if (!mission) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Mission not found'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Mission deleted successfully',
            data: mission
        });
    } catch (error) {
        console.error('Error deleting mission:', error.message);

        if (error.code === '23503') {
            return res.status(409).json({
                status: 'ERROR',
                message:
                    'Cannot delete mission because it is referenced by existing records'
            });
        }

        res.status(500).json({
            status: 'ERROR',
            message: 'Failed to delete mission'
        });
    }
};

module.exports = {
    getAllMissions,
    getMissionById,
    createMission,
    updateMission,
    deleteMission
};