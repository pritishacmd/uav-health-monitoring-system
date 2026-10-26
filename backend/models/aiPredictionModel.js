const pool = require('../config/db');

const getAllPredictions = async () => {
    const result = await pool.query(`
        SELECT
            prediction_id,
            uav_id,
            health_record_id,
            model_name,
            prediction,
            risk_score,
            confidence_score,
            recommended_action,
            predicted_at
        FROM ai_predictions
        ORDER BY prediction_id
    `);

    return result.rows;
};

const getPredictionById = async (id) => {
    const result = await pool.query(`
        SELECT
            prediction_id,
            uav_id,
            health_record_id,
            model_name,
            prediction,
            risk_score,
            confidence_score,
            recommended_action,
            predicted_at
        FROM ai_predictions
        WHERE prediction_id = $1
    `, [id]);

    return result.rows[0];
};

const createPrediction = async ({
    uav_id,
    health_record_id,
    model_name,
    prediction,
    risk_score,
    confidence_score,
    recommended_action,
    predicted_at
}) => {
    const result = await pool.query(`
        INSERT INTO ai_predictions (
            uav_id,
            health_record_id,
            model_name,
            prediction,
            risk_score,
            confidence_score,
            recommended_action,
            predicted_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [
        uav_id,
        health_record_id,
        model_name,
        prediction,
        risk_score,
        confidence_score,
        recommended_action,
        predicted_at
    ]);

    return result.rows[0];
};

const updatePrediction = async (
    id,
    {
        uav_id,
        health_record_id,
        model_name,
        prediction,
        risk_score,
        confidence_score,
        recommended_action,
        predicted_at
    }
) => {
    const result = await pool.query(`
        UPDATE ai_predictions
        SET
            uav_id = $1,
            health_record_id = $2,
            model_name = $3,
            prediction = $4,
            risk_score = $5,
            confidence_score = $6,
            recommended_action = $7,
            predicted_at = $8
        WHERE prediction_id = $9
        RETURNING *
    `, [
        uav_id,
        health_record_id,
        model_name,
        prediction,
        risk_score,
        confidence_score,
        recommended_action,
        predicted_at,
        id
    ]);

    return result.rows[0];
};

const deletePrediction = async (id) => {
    const result = await pool.query(`
        DELETE FROM ai_predictions
        WHERE prediction_id = $1
        RETURNING *
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getAllPredictions,
    getPredictionById,
    createPrediction,
    updatePrediction,
    deletePrediction
};