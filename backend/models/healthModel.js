const pool = require('../config/db');

const getAllHealthRecords = async () => {
    const result = await pool.query(`
        SELECT
            health_record_id,
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        FROM health_records
        ORDER BY health_record_id
    `);

    return result.rows;
};

const getHealthRecordById = async (id) => {
    const result = await pool.query(`
        SELECT
            health_record_id,
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        FROM health_records
        WHERE health_record_id = $1
    `, [id]);

    return result.rows[0];
};

const createHealthRecord = async ({
    uav_id,
    telemetry_id,
    overall_health_score,
    battery_health_score,
    motor_health_score,
    sensor_health_score,
    communication_health_score,
    health_status,
    evaluated_at
}) => {
    const result = await pool.query(`
        INSERT INTO health_records (
            uav_id,
            telemetry_id,
            overall_health_score,
            battery_health_score,
            motor_health_score,
            sensor_health_score,
            communication_health_score,
            health_status,
            evaluated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `, [
        uav_id,
        telemetry_id,
        overall_health_score,
        battery_health_score,
        motor_health_score,
        sensor_health_score,
        communication_health_score,
        health_status,
        evaluated_at
    ]);

    return result.rows[0];
};

const updateHealthRecord = async (
    id,
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
) => {
    const result = await pool.query(`
        UPDATE health_records
        SET
            uav_id = $1,
            telemetry_id = $2,
            overall_health_score = $3,
            battery_health_score = $4,
            motor_health_score = $5,
            sensor_health_score = $6,
            communication_health_score = $7,
            health_status = $8,
            evaluated_at = $9
        WHERE health_record_id = $10
        RETURNING *
    `, [
        uav_id,
        telemetry_id,
        overall_health_score,
        battery_health_score,
        motor_health_score,
        sensor_health_score,
        communication_health_score,
        health_status,
        evaluated_at,
        id
    ]);

    return result.rows[0];
};

const deleteHealthRecord = async (id) => {
    const result = await pool.query(`
        DELETE FROM health_records
        WHERE health_record_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllHealthRecords,
    getHealthRecordById,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
};