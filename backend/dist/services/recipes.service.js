"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipesService = void 0;
const recipes_1 = require("../models/recipes");
const ApiError_1 = require("../utils/ApiError");
class RecipesService {
    async createRecipe(recipeData, user) {
        try {
            const recipeWithUser = {
                ...recipeData,
                createdBy: user.username,
                updatedBy: user.username
            };
            const recipe = new recipes_1.RecipeModel(recipeWithUser);
            const savedRecipe = await recipe.save();
            return savedRecipe;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ApiError_1.ApiError(409, "Recipe with this title already exists");
            }
            throw new ApiError_1.ApiError(500, "Error creating recipe: " + error.message);
        }
    }
    async getAllRecipes(page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc") {
        try {
            const skip = (page - 1) * limit;
            // Build query
            let query = {};
            if (search) {
                query.$text = { $search: search };
            }
            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === "asc" ? 1 : -1;
            const [recipes, total] = await Promise.all([
                recipes_1.RecipeModel.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                recipes_1.RecipeModel.countDocuments(query)
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                recipes,
                total,
                page,
                totalPages
            };
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, "Error fetching recipes: " + error.message);
        }
    }
    async getRecipeById(id) {
        try {
            const recipe = await recipes_1.RecipeModel.findById(id).lean();
            if (!recipe) {
                throw new ApiError_1.ApiError(404, "Recipe not found");
            }
            return recipe;
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, "Error fetching recipe: " + error.message);
        }
    }
    async updateRecipe(id, updateData, user) {
        try {
            const updateDataWithUser = {
                ...updateData,
                updatedBy: user.username
            };
            const recipe = await recipes_1.RecipeModel.findByIdAndUpdate(id, { $set: updateDataWithUser }, { new: true, runValidators: true }).lean();
            if (!recipe) {
                throw new ApiError_1.ApiError(404, "Recipe not found");
            }
            return recipe;
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            if (error.code === 11000) {
                throw new ApiError_1.ApiError(409, "Recipe with this title already exists");
            }
            throw new ApiError_1.ApiError(500, "Error updating recipe: " + error.message);
        }
    }
    async deleteRecipe(id) {
        try {
            const recipe = await recipes_1.RecipeModel.findByIdAndDelete(id);
            if (!recipe) {
                throw new ApiError_1.ApiError(404, "Recipe not found");
            }
        }
        catch (error) {
            if (error instanceof ApiError_1.ApiError) {
                throw error;
            }
            throw new ApiError_1.ApiError(500, "Error deleting recipe: " + error.message);
        }
    }
    async searchByIngredients(ingredients) {
        try {
            const recipes = await recipes_1.RecipeModel.find({
                ingredients: { $in: ingredients }
            }).lean();
            return recipes;
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, "Error searching recipes: " + error.message);
        }
    }
    async getRecipesByCookingTime(minTime, maxTime) {
        try {
            let query = {};
            if (minTime !== undefined || maxTime !== undefined) {
                query.cookingTime = {};
                if (minTime !== undefined) {
                    query.cookingTime.$gte = minTime;
                }
                if (maxTime !== undefined) {
                    query.cookingTime.$lte = maxTime;
                }
            }
            const recipes = await recipes_1.RecipeModel.find(query).lean();
            return recipes;
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, "Error fetching recipes by cooking time: " + error.message);
        }
    }
}
exports.recipesService = new RecipesService();
