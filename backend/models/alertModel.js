const pool = require('../config/db');

const getAllAlerts = async () => {
    const result = await pool.query(`
        SELECT
            alert_id,
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            created_at,
            resolved_at
        FROM alerts
        ORDER BY alert_id
    `);

    return result.rows;
};

const getAlertById = async (id) => {
    const result = await pool.query(`
        SELECT
            alert_id,
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            created_at,
            resolved_at
        FROM alerts
        WHERE alert_id = $1
    `, [id]);

    return result.rows[0];
};

const createAlert = async ({
    uav_id,
    prediction_id,
    alert_type,
    severity,
    message,
    status,
    resolved_at
}) => {
    const result = await pool.query(`
        INSERT INTO alerts (
            uav_id,
            prediction_id,
            alert_type,
            severity,
            message,
            status,
            resolved_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [
        uav_id,
        prediction_id,
        alert_type,
        severity,
        message,
        status || 'ACTIVE',
        resolved_at
    ]);

    return result.rows[0];
};

const updateAlert = async (id, {
    uav_id,
    prediction_id,
    alert_type,
    severity,
    message,
    status,
    resolved_at
}) => {
    const result = await pool.query(`
        UPDATE alerts
        SET
            uav_id = $1,
            prediction_id = $2,
            alert_type = $3,
            severity = $4,
            message = $5,
            status = $6,
            resolved_at = $7
        WHERE alert_id = $8
        RETURNING *
    `, [
        uav_id,
        prediction_id,
        alert_type,
        severity,
        message,
        status,
        resolved_at,
        id
    ]);

    return result.rows[0];
};

const deleteAlert = async (id) => {
    const result = await pool.query(`
        DELETE FROM alerts
        WHERE alert_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert
};