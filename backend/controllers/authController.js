const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await authModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                message: 'User account is inactive'
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Login failed'
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: 'Not logged in'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await authModel.findUserByEmail(decoded.email);

        if (!user || !user.is_active) {
            return res.status(401).json({
                message: 'User not found or inactive'
            });
        }

        res.json({
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error(error);

        res.status(401).json({
            message: 'Invalid or expired login session'
        });
    }
};

const register = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            phone
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: 'Full name, email and password are required'
            });
        }

        const existingUser = await authModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists'
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await authModel.createUser(
            full_name,
            email,
            password_hash,
            'OPERATOR',
            phone || null
        );

        res.status(201).json({
            message: 'User registered successfully',
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};

module.exports = {
    login,
    getCurrentUser,
    register
};