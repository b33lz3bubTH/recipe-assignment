"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const recipes_service_1 = require("../services/recipes.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const auth_middleware_1 = require("../middleware/auth.middleware");
const recipe_validator_1 = require("../validators/recipe.validator");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticateToken, (0, celebrate_1.celebrate)(recipe_validator_1.createRecipeSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const recipeData = req.body;
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "User information not found");
    }
    const recipe = await recipes_service_1.recipesService.createRecipe(recipeData, req.user);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { recipe }, "Recipe created successfully"));
}));
router.get("/", (0, celebrate_1.celebrate)(recipe_validator_1.getRecipesSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    const result = await recipes_service_1.recipesService.getAllRecipes(Number(page), Number(limit), search, sortBy, sortOrder);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Recipes retrieved successfully"));
}));
router.get("/:id", (0, celebrate_1.celebrate)(recipe_validator_1.getRecipeByIdSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const recipe = await recipes_service_1.recipesService.getRecipeById(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { recipe }, "Recipe retrieved successfully"));
}));
router.put("/:id", auth_middleware_1.authenticateToken, (0, celebrate_1.celebrate)(recipe_validator_1.updateRecipeSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!req.user) {
        throw new ApiError_1.ApiError(401, "User information not found");
    }
    const recipe = await recipes_service_1.recipesService.updateRecipe(id, updateData, req.user);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { recipe }, "Recipe updated successfully"));
}));
router.delete("/:id", auth_middleware_1.authenticateToken, (0, celebrate_1.celebrate)(recipe_validator_1.deleteRecipeSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await recipes_service_1.recipesService.deleteRecipe(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "Recipe deleted successfully"));
}));
router.get("/search/ingredients", (0, celebrate_1.celebrate)(recipe_validator_1.searchByIngredientsSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { ingredients } = req.query;
    const ingredientsArray = ingredients.split(",").map(i => i.trim());
    const recipes = await recipes_service_1.recipesService.searchByIngredients(ingredientsArray);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { recipes, count: recipes.length }, "Recipes found successfully"));
}));
router.get("/search/cooking-time", (0, celebrate_1.celebrate)(recipe_validator_1.getRecipesByCookingTimeSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { minTime, maxTime } = req.query;
    const recipes = await recipes_service_1.recipesService.getRecipesByCookingTime(minTime ? Number(minTime) : undefined, maxTime ? Number(maxTime) : undefined);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { recipes, count: recipes.length }, "Recipes found successfully"));
}));
exports.default = router;
