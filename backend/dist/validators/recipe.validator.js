"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipesByCookingTimeSchema = exports.searchByIngredientsSchema = exports.deleteRecipeSchema = exports.getRecipeByIdSchema = exports.getRecipesSchema = exports.updateRecipeSchema = exports.createRecipeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createRecipeSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().required().trim().min(1).max(200).messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 1 character long",
            "string.max": "Title cannot exceed 200 characters",
        }),
        ingredients: joi_1.default.array().items(joi_1.default.string().trim().min(1)).min(1).required().messages({
            "array.min": "At least one ingredient is required",
            "array.base": "Ingredients must be an array",
        }),
        instructions: joi_1.default.string().required().trim().min(10).max(5000).messages({
            "string.empty": "Instructions are required",
            "string.min": "Instructions must be at least 10 characters long",
            "string.max": "Instructions cannot exceed 5000 characters",
        }),
        cookingTime: joi_1.default.alternatives().try(joi_1.default.string().trim().min(1).max(50), joi_1.default.number().positive().integer()).required().messages({
            "alternatives.any": "Cooking time must be a string or positive number",
        }),
        imageUrl: joi_1.default.string().optional().allow("").messages({
            "string.uri": "Image URL must be a valid URL",
        }),
    }).unknown(true),
};
exports.updateRecipeSchema = {
    body: joi_1.default.object({
        title: joi_1.default.string().trim().min(1).max(200).optional().messages({
            "string.min": "Title must be at least 1 character long",
            "string.max": "Title cannot exceed 200 characters",
        }),
        ingredients: joi_1.default.array().items(joi_1.default.string().trim().min(1)).min(1).optional().messages({
            "array.min": "At least one ingredient is required",
            "array.base": "Ingredients must be an array",
        }),
        instructions: joi_1.default.string().trim().min(10).max(5000).optional().messages({
            "string.min": "Instructions must be at least 10 characters long",
            "string.max": "Instructions cannot exceed 5000 characters",
        }),
        cookingTime: joi_1.default.alternatives().try(joi_1.default.string().trim().min(1).max(50), joi_1.default.number().positive().integer()).optional().messages({
            "alternatives.any": "Cooking time must be a string or positive number",
        }),
        imageUrl: joi_1.default.string().optional().allow("").messages({
            "string.uri": "Image URL must be a valid URL",
        }),
        _id: joi_1.default.string().optional().allow("").messages({}),
    }).unknown(true),
};
exports.getRecipesSchema = {
    query: joi_1.default.object({
        page: joi_1.default.number().integer().min(1).default(1),
        limit: joi_1.default.number().integer().min(1).max(100).default(10),
        search: joi_1.default.string().trim().optional(),
        sortBy: joi_1.default.string().valid("title", "cookingTime", "createdAt", "updatedAt").default("createdAt"),
        sortOrder: joi_1.default.string().valid("asc", "desc").default("desc"),
    }),
};
exports.getRecipeByIdSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required().messages({
            "string.empty": "Recipe ID is required",
        }),
    }),
};
exports.deleteRecipeSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().required().messages({
            "string.empty": "Recipe ID is required",
        }),
    }),
};
exports.searchByIngredientsSchema = {
    query: joi_1.default.object({
        ingredients: joi_1.default.string().required().messages({
            "string.empty": "Ingredients parameter is required",
        }),
    }),
};
exports.getRecipesByCookingTimeSchema = {
    query: joi_1.default.object({
        minTime: joi_1.default.number().positive().integer().optional(),
        maxTime: joi_1.default.number().positive().integer().optional(),
    }).custom((value, helpers) => {
        if (value.minTime && value.maxTime && value.minTime > value.maxTime) {
            return helpers.error("any.invalid", { message: "minTime cannot be greater than maxTime" });
        }
        return value;
    }),
};
