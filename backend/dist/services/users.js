"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const config_1 = require("../config");
class UsersService {
    constructor(model = users_1.UserModel) {
        this.model = model;
    }
    generateTokens(userPayload) {
        // @ts-ignore - Ignoring JWT typing issues for now
        const accessToken = jsonwebtoken_1.default.sign(userPayload, config_1.appConfig.jwtSecret, { expiresIn: config_1.appConfig.jwtExpiresIn });
        // @ts-ignore - Ignoring JWT typing issues for now
        const refreshToken = jsonwebtoken_1.default.sign(userPayload, config_1.appConfig.jwtSecret, { expiresIn: config_1.appConfig.jwtRefreshExpiresIn });
        return {
            accessToken,
            refreshToken,
        };
    }
    async registration(data) {
        // Check if user already exists
        const existingUser = await this.model.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });
        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }
        // Hash the password
        const saltRounds = config_1.appConfig.bcryptSaltRounds;
        const hashedPassword = await bcryptjs_1.default.hash(data.password, saltRounds);
        // Create user with hashed password
        const user = await this.model.create({
            ...data,
            password: hashedPassword
        });
        // Generate tokens
        const tokens = this.generateTokens({
            id: user._id.toString(),
            email: user.email,
            username: user.username
        });
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username
            },
            tokens
        };
    }
    async login(email, password) {
        // Find user by email
        const user = await this.model.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate tokens
        const tokens = this.generateTokens({
            id: user._id.toString(),
            email: user.email,
            username: user.username
        });
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username
            },
            tokens
        };
    }
    async verifyToken(token) {
        try {
            // @ts-ignore - Ignoring JWT typing issues for now
            return jsonwebtoken_1.default.verify(token, config_1.appConfig.jwtSecret);
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    async refreshToken(refreshToken) {
        try {
            // @ts-ignore - Ignoring JWT typing issues for now
            const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.appConfig.jwtSecret);
            // Check if user still exists
            const user = await this.model.findById(payload.id);
            if (!user) {
                throw new Error('User not found');
            }
            return this.generateTokens({
                id: user._id.toString(),
                email: user.email,
                username: user.username
            });
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.UsersService = UsersService;
