"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const users_1 = require("../services/users");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
            return;
        }
        const usersService = new users_1.UsersService();
        const payload = await usersService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const usersService = new users_1.UsersService();
            const payload = await usersService.verifyToken(token);
            req.user = payload;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
