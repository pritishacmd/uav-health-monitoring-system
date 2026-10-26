const db = require('../config/db');

const getAllMissions = async () => {
    const result = await db.query(`
        SELECT
            mission_id,
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
        FROM missions
        ORDER BY mission_id
    `);

    return result.rows;
};

const getMissionById = async (missionId) => {
    const result = await db.query(`
        SELECT
            mission_id,
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
        FROM missions
        WHERE mission_id = $1
    `, [missionId]);

    return result.rows[0];
};

const createMission = async ({
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
}) => {
    const result = await db.query(`
        INSERT INTO missions (
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
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `, [
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
        status || 'PLANNED'
    ]);

    return result.rows[0];
};

const updateMission = async (missionId, {
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
}) => {
    const result = await db.query(`
        UPDATE missions
        SET
            uav_id = $1,
            created_by = $2,
            mission_name = $3,
            description = $4,
            start_time = $5,
            end_time = $6,
            start_latitude = $7,
            start_longitude = $8,
            destination_latitude = $9,
            destination_longitude = $10,
            status = $11
        WHERE mission_id = $12
        RETURNING *
    `, [
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
        status,
        missionId
    ]);

    return result.rows[0];
};

const deleteMission = async (missionId) => {
    const result = await db.query(`
        DELETE FROM missions
        WHERE mission_id = $1
        RETURNING *
    `, [missionId]);

    return result.rows[0];
};

module.exports = {
    getAllMissions,
    getMissionById,
    createMission,
    updateMission,
    deleteMission
};