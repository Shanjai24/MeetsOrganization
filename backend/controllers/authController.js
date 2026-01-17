const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authController = {
    login: async(req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide both email and password'
                });
            }

            const [users] = await db.query(
                'SELECT * FROM users WHERE email = ?', [email]
            );

            if (users.length === 0) {
                try {
                    const [result] = await db.query(
                        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                        [email.split('@')[0], email, password]
                    );

                    const token = jwt.sign({ 
                        userId: result.insertId,
                        id: result.insertId,
                        email: email 
                    },
                        process.env.JWT_SECRET || 'your-jwt-secret', 
                        { expiresIn: '24h' }
                    );

                    return res.json({
                        success: true,
                        token,
                        user: {
                            id: result.insertId,
                            name: email.split('@')[0],
                            email: email
                        }
                    });
                } catch (error) {
                    console.error('Error creating user:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Server error during registration'
                    });
                }
            }

            const user = users[0];

            const isMatch = password === user.password;
            
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email/password'
                });
            }

            const token = jwt.sign({ 
                userId: user.id,
                id: user.id,
                email: user.email 
            },
                process.env.JWT_SECRET || 'your-jwt-secret', 
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    },

    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;

            // Validation
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Check existing user
            const [existingUsers] = await db.query(
                'SELECT * FROM users WHERE email = ?', [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const [result] = await db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                [name, email, hashedPassword]
            );

            // Generate token with both id and userId for compatibility
            const token = jwt.sign({ 
                userId: result.insertId,
                id: result.insertId,
                email 
            },
                process.env.JWT_SECRET || 'your-jwt-secret', 
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: result.insertId,
                    name,
                    email
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    },

    getMe: async(req, res) => {
        try {
            // Fetch user details (excluding sensitive information)
            const [users] = await db.query(
                'SELECT id, name, email FROM users WHERE id = ?', [req.user.userId || req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: users[0]
            });
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error retrieving user data'
            });
        }
    },

    verify: async(req, res) => {
        try {
            // Simply verify the token and return user info
            const [users] = await db.query(
                'SELECT id, name, email FROM users WHERE id = ?', [req.user.userId || req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: users[0]
            });
        } catch (error) {
            console.error('Verify error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error verifying token'
            });
        }
    }
};

module.exports = authController;