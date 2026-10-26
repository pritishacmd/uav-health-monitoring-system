const pool = require('../config/db');

const getAllFlightHistory = async () => {
    const result = await pool.query(`
        SELECT
            flight_id,
            uav_id,
            mission_id,
            start_time,
            end_time,
            duration_minutes,
            distance_km,
            maximum_altitude,
            maximum_speed,
            final_battery_percentage,
            flight_status,
            created_at
        FROM flight_history
        ORDER BY flight_id
    `);

    return result.rows;
};

const getFlightHistoryById = async (id) => {
    const result = await pool.query(`
        SELECT
            flight_id,
            uav_id,
            mission_id,
            start_time,
            end_time,
            duration_minutes,
            distance_km,
            maximum_altitude,
            maximum_speed,
            final_battery_percentage,
            flight_status,
            created_at
        FROM flight_history
        WHERE flight_id = $1
    `, [id]);

    return result.rows[0];
};

const createFlightHistory = async ({
    uav_id,
    mission_id,
    start_time,
    end_time,
    duration_minutes,
    distance_km,
    maximum_altitude,
    maximum_speed,
    final_battery_percentage,
    flight_status
}) => {
    const result = await pool.query(`
        INSERT INTO flight_history (
            uav_id,
            mission_id,
            start_time,
            end_time,
            duration_minutes,
            distance_km,
            maximum_altitude,
            maximum_speed,
            final_battery_percentage,
            flight_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [
        uav_id,
        mission_id,
        start_time,
        end_time,
        duration_minutes,
        distance_km,
        maximum_altitude,
        maximum_speed,
        final_battery_percentage,
        flight_status
    ]);

    return result.rows[0];
};

const updateFlightHistory = async (
    id,
    {
        uav_id,
        mission_id,
        start_time,
        end_time,
        duration_minutes,
        distance_km,
        maximum_altitude,
        maximum_speed,
        final_battery_percentage,
        flight_status
    }
) => {
    const result = await pool.query(`
        UPDATE flight_history
        SET
            uav_id = $1,
            mission_id = $2,
            start_time = $3,
            end_time = $4,
            duration_minutes = $5,
            distance_km = $6,
            maximum_altitude = $7,
            maximum_speed = $8,
            final_battery_percentage = $9,
            flight_status = $10
        WHERE flight_id = $11
        RETURNING *
    `, [
        uav_id,
        mission_id,
        start_time,
        end_time,
        duration_minutes,
        distance_km,
        maximum_altitude,
        maximum_speed,
        final_battery_percentage,
        flight_status,
        id
    ]);

    return result.rows[0];
};

const deleteFlightHistory = async (id) => {
    const result = await pool.query(`
        DELETE FROM flight_history
        WHERE flight_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllFlightHistory,
    getFlightHistoryById,
    createFlightHistory,
    updateFlightHistory,
    deleteFlightHistory
};