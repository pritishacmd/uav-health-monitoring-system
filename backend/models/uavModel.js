const db = require('../config/db');

const getAllUavs = async () => {
    const result = await db.query(`
        SELECT
            uav_id,
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date,
            created_at,
            updated_at
        FROM uavs
        ORDER BY uav_id
    `);

    return result.rows;
};

const getUavById = async (uavId) => {
    const result = await db.query(`
        SELECT
            uav_id,
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date,
            created_at,
            updated_at
        FROM uavs
        WHERE uav_id = $1
    `, [uavId]);

    return result.rows[0];
};

const createUav = async ({
    uav_name,
    model,
    serial_number,
    manufacturer,
    status,
    battery_capacity,
    purchase_date,
    last_maintenance_date
}) => {
    const result = await db.query(`
        INSERT INTO uavs (
            uav_name,
            model,
            serial_number,
            manufacturer,
            status,
            battery_capacity,
            purchase_date,
            last_maintenance_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [
        uav_name,
        model,
        serial_number,
        manufacturer,
        status || 'AVAILABLE',
        battery_capacity,
        purchase_date,
        last_maintenance_date
    ]);

    return result.rows[0];
};

const updateUav = async (uavId, {
    uav_name,
    model,
    serial_number,
    manufacturer,
    status,
    battery_capacity,
    purchase_date,
    last_maintenance_date
}) => {
    const result = await db.query(`
        UPDATE uavs
        SET
            uav_name = $1,
            model = $2,
            serial_number = $3,
            manufacturer = $4,
            status = $5,
            battery_capacity = $6,
            purchase_date = $7,
            last_maintenance_date = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE uav_id = $9
        RETURNING *
    `, [
        uav_name,
        model,
        serial_number,
        manufacturer,
        status,
        battery_capacity,
        purchase_date,
        last_maintenance_date,
        uavId
    ]);

    return result.rows[0];
};

const deleteUav = async (uavId) => {
    const result = await db.query(`
        DELETE FROM uavs
        WHERE uav_id = $1
        RETURNING *
    `, [uavId]);

    return result.rows[0];
};

module.exports = {
    getAllUavs,
    getUavById,
    createUav,
    updateUav,
    deleteUav
};