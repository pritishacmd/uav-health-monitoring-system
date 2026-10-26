const pool = require('../config/db');

const getAllMaintenance = async () => {
    const result = await pool.query(`
        SELECT
            maintenance_id,
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes,
            created_at
        FROM maintenance
        ORDER BY maintenance_id
    `);

    return result.rows;
};

const getMaintenanceById = async (id) => {
    const result = await pool.query(`
        SELECT
            maintenance_id,
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes,
            created_at
        FROM maintenance
        WHERE maintenance_id = $1
    `, [id]);

    return result.rows[0];
};

const createMaintenance = async ({
    uav_id,
    maintenance_type,
    description,
    scheduled_date,
    completed_date,
    performed_by,
    status,
    notes
}) => {
    const result = await pool.query(`
        INSERT INTO maintenance (
            uav_id,
            maintenance_type,
            description,
            scheduled_date,
            completed_date,
            performed_by,
            status,
            notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [
        uav_id,
        maintenance_type,
        description,
        scheduled_date,
        completed_date,
        performed_by,
        status,
        notes
    ]);

    return result.rows[0];
};

const updateMaintenance = async (
    id,
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
) => {
    const result = await pool.query(`
        UPDATE maintenance
        SET
            uav_id = $1,
            maintenance_type = $2,
            description = $3,
            scheduled_date = $4,
            completed_date = $5,
            performed_by = $6,
            status = $7,
            notes = $8
        WHERE maintenance_id = $9
        RETURNING *
    `, [
        uav_id,
        maintenance_type,
        description,
        scheduled_date,
        completed_date,
        performed_by,
        status,
        notes,
        id
    ]);

    return result.rows[0];
};

const deleteMaintenance = async (id) => {
    const result = await pool.query(`
        DELETE FROM maintenance
        WHERE maintenance_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
};