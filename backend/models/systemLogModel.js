const pool = require('../config/db');

const getAllSystemLogs = async () => {
    const result = await pool.query(`
        SELECT
            log_id,
            user_id,
            action,
            description,
            ip_address,
            created_at
        FROM system_logs
        ORDER BY log_id
    `);

    return result.rows;
};

const getSystemLogById = async (id) => {
    const result = await pool.query(`
        SELECT
            log_id,
            user_id,
            action,
            description,
            ip_address,
            created_at
        FROM system_logs
        WHERE log_id = $1
    `, [id]);

    return result.rows[0];
};

const createSystemLog = async ({
    user_id,
    action,
    description,
    ip_address
}) => {
    const result = await pool.query(`
        INSERT INTO system_logs (
            user_id,
            action,
            description,
            ip_address
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [
        user_id,
        action,
        description,
        ip_address
    ]);

    return result.rows[0];
};

const updateSystemLog = async (
    id,
    {
        user_id,
        action,
        description,
        ip_address
    }
) => {
    const result = await pool.query(`
        UPDATE system_logs
        SET
            user_id = $1,
            action = $2,
            description = $3,
            ip_address = $4
        WHERE log_id = $5
        RETURNING *
    `, [
        user_id,
        action,
        description,
        ip_address,
        id
    ]);

    return result.rows[0];
};

const deleteSystemLog = async (id) => {
    const result = await pool.query(`
        DELETE FROM system_logs
        WHERE log_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllSystemLogs,
    getSystemLogById,
    createSystemLog,
    updateSystemLog,
    deleteSystemLog
};