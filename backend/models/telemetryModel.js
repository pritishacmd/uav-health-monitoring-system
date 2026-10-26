const pool = require('../config/db');

const getAllTelemetry = async () => {
    const result = await pool.query(`
        SELECT
            telemetry_id,
            uav_id,
            mission_id,
            recorded_at,
            latitude,
            longitude,
            altitude,
            speed,
            battery_percentage,
            battery_voltage,
            battery_current,
            temperature,
            pressure,
            humidity,
            vibration,
            motor_1_rpm,
            motor_2_rpm,
            motor_3_rpm,
            motor_4_rpm,
            gps_signal,
            communication_signal,
            flight_mode,
            created_at
        FROM telemetry
        ORDER BY telemetry_id
    `);

    return result.rows;
};

const getTelemetryById = async (id) => {
    const result = await pool.query(`
        SELECT
            telemetry_id,
            uav_id,
            mission_id,
            recorded_at,
            latitude,
            longitude,
            altitude,
            speed,
            battery_percentage,
            battery_voltage,
            battery_current,
            temperature,
            pressure,
            humidity,
            vibration,
            motor_1_rpm,
            motor_2_rpm,
            motor_3_rpm,
            motor_4_rpm,
            gps_signal,
            communication_signal,
            flight_mode,
            created_at
        FROM telemetry
        WHERE telemetry_id = $1
    `, [id]);

    return result.rows[0];
};

const createTelemetry = async ({
    uav_id,
    mission_id,
    recorded_at,
    latitude,
    longitude,
    altitude,
    speed,
    battery_percentage,
    battery_voltage,
    battery_current,
    temperature,
    pressure,
    humidity,
    vibration,
    motor_1_rpm,
    motor_2_rpm,
    motor_3_rpm,
    motor_4_rpm,
    gps_signal,
    communication_signal,
    flight_mode
}) => {
    const result = await pool.query(`
        INSERT INTO telemetry (
            uav_id,
            mission_id,
            recorded_at,
            latitude,
            longitude,
            altitude,
            speed,
            battery_percentage,
            battery_voltage,
            battery_current,
            temperature,
            pressure,
            humidity,
            vibration,
            motor_1_rpm,
            motor_2_rpm,
            motor_3_rpm,
            motor_4_rpm,
            gps_signal,
            communication_signal,
            flight_mode
        )
        VALUES (
            $1, $2, COALESCE($3, CURRENT_TIMESTAMP),
            $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18,
            $19, $20, $21
        )
        RETURNING *
    `, [
        uav_id,
        mission_id,
        recorded_at,
        latitude,
        longitude,
        altitude,
        speed,
        battery_percentage,
        battery_voltage,
        battery_current,
        temperature,
        pressure,
        humidity,
        vibration,
        motor_1_rpm,
        motor_2_rpm,
        motor_3_rpm,
        motor_4_rpm,
        gps_signal,
        communication_signal,
        flight_mode
    ]);

    return result.rows[0];
};

const updateTelemetry = async (id, {
    uav_id,
    mission_id,
    recorded_at,
    latitude,
    longitude,
    altitude,
    speed,
    battery_percentage,
    battery_voltage,
    battery_current,
    temperature,
    pressure,
    humidity,
    vibration,
    motor_1_rpm,
    motor_2_rpm,
    motor_3_rpm,
    motor_4_rpm,
    gps_signal,
    communication_signal,
    flight_mode
}) => {
    const result = await pool.query(`
        UPDATE telemetry
        SET
            uav_id = $1,
            mission_id = $2,
            recorded_at = $3,
            latitude = $4,
            longitude = $5,
            altitude = $6,
            speed = $7,
            battery_percentage = $8,
            battery_voltage = $9,
            battery_current = $10,
            temperature = $11,
            pressure = $12,
            humidity = $13,
            vibration = $14,
            motor_1_rpm = $15,
            motor_2_rpm = $16,
            motor_3_rpm = $17,
            motor_4_rpm = $18,
            gps_signal = $19,
            communication_signal = $20,
            flight_mode = $21
        WHERE telemetry_id = $22
        RETURNING *
    `, [
        uav_id,
        mission_id,
        recorded_at,
        latitude,
        longitude,
        altitude,
        speed,
        battery_percentage,
        battery_voltage,
        battery_current,
        temperature,
        pressure,
        humidity,
        vibration,
        motor_1_rpm,
        motor_2_rpm,
        motor_3_rpm,
        motor_4_rpm,
        gps_signal,
        communication_signal,
        flight_mode,
        id
    ]);

    return result.rows[0];
};

const deleteTelemetry = async (id) => {
    const result = await pool.query(`
        DELETE FROM telemetry
        WHERE telemetry_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllTelemetry,
    getTelemetryById,
    createTelemetry,
    updateTelemetry,
    deleteTelemetry
};