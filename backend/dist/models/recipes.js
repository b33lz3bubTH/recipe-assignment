"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose_1 = require("mongoose");
const base_1 = require("./base");
const collections_1 = require("./collections");
const schemaFields = {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    ingredients: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one ingredient is required'
        }
    },
    instructions: {
        type: String,
        required: true,
        trim: true,
    },
    cookingTime: {
        type: mongoose_1.Schema.Types.Mixed, // Can be String or Number
        required: true,
        validate: {
            validator: function (v) {
                if (typeof v === 'string') {
                    return v.trim().length > 0;
                }
                if (typeof v === 'number') {
                    return v > 0;
                }
                return false;
            },
            message: 'Cooking time must be a non-empty string or positive number'
        }
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    createdBy: {
        type: String,
        required: true,
        trim: true,
    },
    updatedBy: {
        type: String,
        required: true,
        trim: true,
    }
};
const schema = new mongoose_1.Schema({
    ...base_1.baseSchemaFields,
    ...schemaFields,
});
schema.index({
    title: "text",
    ingredients: "text",
    instructions: "text",
}, {
    name: "Recipes_search_index",
    weights: {
        title: 10,
        ingredients: 5,
        instructions: 3,
    },
});
exports.RecipeModel = (0, mongoose_1.model)(collections_1.ModelRefs.Recipes, schema);
