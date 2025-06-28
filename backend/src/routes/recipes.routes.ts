import { Router, Request, Response } from "express";
import { celebrate } from "celebrate";
import { recipesService } from "../services/recipes.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createRecipeSchema,
  updateRecipeSchema,
  getRecipesSchema,
  getRecipeByIdSchema,
  deleteRecipeSchema,
  searchByIngredientsSchema,
  getRecipesByCookingTimeSchema,
} from "../validators/recipe.validator";

const router = Router();

router.post(
  "/",
  authenticateToken,
  celebrate(createRecipeSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const recipeData = req.body;
    
    if (!req.user) {
      throw new ApiError(401, "User information not found");
    }
    
    const recipe = await recipesService.createRecipe(recipeData, req.user);
    
    res.status(201).json(
      new ApiResponse(201, { recipe }, "Recipe created successfully")
    );
  })
);


router.get(
  "/",
  celebrate(getRecipesSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search, sortBy, sortOrder } = req.query;
    
    const result = await recipesService.getAllRecipes(
      Number(page),
      Number(limit),
      search as string,
      sortBy as string,
      sortOrder as "asc" | "desc"
    );
    
    res.status(200).json(
      new ApiResponse(200, result, "Recipes retrieved successfully")
    );
  })
);


router.get(
  "/:id",
  celebrate(getRecipeByIdSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const recipe = await recipesService.getRecipeById(id);
    
    res.status(200).json(
      new ApiResponse(200, { recipe }, "Recipe retrieved successfully")
    );
  })
);

router.put(
  "/:id",
  authenticateToken,
  celebrate(updateRecipeSchema),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!req.user) {
      throw new ApiError(401, "User information not found");
    }
    
    const recipe = await recipesService.updateRecipe(id, updateData, req.user);
    
    res.status(200).json(
      new ApiResponse(200, { recipe }, "Recipe updated successfully")
    );
  })
);


router.delete(
  "/:id",
  authenticateToken,
  celebrate(deleteRecipeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await recipesService.deleteRecipe(id);
    
    res.status(200).json(
      new ApiResponse(200, null, "Recipe deleted successfully")
    );
  })
);


router.get(
  "/search/ingredients",
  celebrate(searchByIngredientsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { ingredients } = req.query;
    const ingredientsArray = (ingredients as string).split(",").map(i => i.trim());
    
    const recipes = await recipesService.searchByIngredients(ingredientsArray);
    
    res.status(200).json(
      new ApiResponse(200, { recipes, count: recipes.length }, "Recipes found successfully")
    );
  })
);

router.get(
  "/search/cooking-time",
  celebrate(getRecipesByCookingTimeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { minTime, maxTime } = req.query;
    
    const recipes = await recipesService.getRecipesByCookingTime(
      minTime ? Number(minTime) : undefined,
      maxTime ? Number(maxTime) : undefined
    );
    
    res.status(200).json(
      new ApiResponse(200, { recipes, count: recipes.length }, "Recipes found successfully")
    );
  })
);

export default router; 