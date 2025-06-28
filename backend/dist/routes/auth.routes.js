"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const users_1 = require("../services/users");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
const usersService = new users_1.UsersService();
router.post('/register', (0, celebrate_1.celebrate)(auth_validator_1.registerSchema), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await usersService.registration({ username, email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });
    }
    catch (error) {
        if (error.message.includes('already exists')) {
            res.status(409).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/login', (0, celebrate_1.celebrate)(auth_validator_1.loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await usersService.login(email, password);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        if (error.message.includes('Invalid email or password')) {
            res.status(401).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/refresh', (0, celebrate_1.celebrate)(auth_validator_1.refreshSchema), async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await usersService.refreshToken(refreshToken);
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens
        });
    }
    catch (error) {
        if (error.message.includes('Invalid refresh token') || error.message.includes('User not found')) {
            res.status(401).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/verify', (0, celebrate_1.celebrate)(auth_validator_1.verifySchema), async (req, res) => {
    try {
        const { token } = req.body;
        const payload = await usersService.verifyToken(token);
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: payload
        });
    }
    catch (error) {
        if (error.message.includes('Invalid token')) {
            res.status(401).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
