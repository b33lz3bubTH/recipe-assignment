"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const celebrate_1 = require("celebrate");
exports.registerSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        username: celebrate_1.Joi.string().min(3).max(30).required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().min(6).required(),
    })
};
exports.loginSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().min(6).required(),
    })
};
exports.refreshSchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        refreshToken: celebrate_1.Joi.string().required(),
    })
};
exports.verifySchema = {
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        token: celebrate_1.Joi.string().required(),
    })
};
