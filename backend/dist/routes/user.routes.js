"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const users_1 = require("../services/users");
const router = (0, express_1.Router)();
const usersService = new users_1.UsersService();
router.get('/profile', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/profile', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const { username } = req.body;
        if (!username) {
            res.status(400).json({
                success: false,
                message: 'Username is required'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: req.user.id,
                email: req.user.email,
                username: username
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
