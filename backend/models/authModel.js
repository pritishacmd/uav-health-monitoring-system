const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT
            user_id,
            full_name,
            email,
            password_hash,
            role,
            phone,
            is_active
        FROM users
        WHERE email = $1
    `, [email]);

    return result.rows[0];
};

const createUser = async (
    full_name,
    email,
    password_hash,
    role,
    phone
) => {
    const result = await pool.query(`
        INSERT INTO users
            (full_name, email, password_hash, role, phone, is_active)
        VALUES
            ($1, $2, $3, $4, $5, true)
        RETURNING
            user_id,
            full_name,
            email,
            role,
            phone,
            is_active
    `, [
        full_name,
        email,
        password_hash,
        role,
        phone
    ]);

    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    createUser
};