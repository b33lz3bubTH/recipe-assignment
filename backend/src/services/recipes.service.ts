import { RecipeModel, IRecipes, RecipesEntity } from "../models/recipes";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

interface UserInfo {
  id: string;
  email: string;
  username: string;
}

class RecipesService {
  /**
   * Create a new recipe
   */
  async createRecipe(recipeData: Omit<RecipesEntity, 'createdBy' | 'updatedBy'>, user: UserInfo): Promise<IRecipes> {
    try {
      const recipeWithUser = {
        ...recipeData,
        createdBy: user.username,
        updatedBy: user.username
      };
      
      const recipe = new RecipeModel(recipeWithUser);
      const savedRecipe = await recipe.save();
      return savedRecipe;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ApiError(409, "Recipe with this title already exists");
      }
      throw new ApiError(500, "Error creating recipe: " + error.message);
    }
  }

  /**
   * Get all recipes with pagination and search
   */
  async getAllRecipes(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ recipes: IRecipes[]; total: number; page: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      // Build query
      let query: any = {};
      
      if (search) {
        query.$text = { $search: search };
      }
      
      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
      
      const [recipes, total] = await Promise.all([
        RecipeModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        RecipeModel.countDocuments(query)
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        recipes,
        total,
        page,
        totalPages
      };
    } catch (error: any) {
      throw new ApiError(500, "Error fetching recipes: " + error.message);
    }
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(id: string): Promise<IRecipes> {
    try {
      const recipe = await RecipeModel.findById(id).lean();
      
      if (!recipe) {
        throw new ApiError(404, "Recipe not found");
      }
      
      return recipe;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Error fetching recipe: " + error.message);
    }
  }

  /**
   * Update recipe by ID
   */
  async updateRecipe(id: string, updateData: Partial<Omit<RecipesEntity, 'createdBy' | 'updatedBy'>>, user: UserInfo): Promise<IRecipes> {
    try {
      const updateDataWithUser = {
        ...updateData,
        updatedBy: user.username
      };
      
      const recipe = await RecipeModel.findByIdAndUpdate(
        id,
        { $set: updateDataWithUser },
        { new: true, runValidators: true }
      ).lean();
      
      if (!recipe) {
        throw new ApiError(404, "Recipe not found");
      }
      
      return recipe;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (error.code === 11000) {
        throw new ApiError(409, "Recipe with this title already exists");
      }
      throw new ApiError(500, "Error updating recipe: " + error.message);
    }
  }

  /**
   * Delete recipe by ID
   */
  async deleteRecipe(id: string): Promise<void> {
    try {
      const recipe = await RecipeModel.findByIdAndDelete(id);
      
      if (!recipe) {
        throw new ApiError(404, "Recipe not found");
      }
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Error deleting recipe: " + error.message);
    }
  }

  /**
   * Search recipes by ingredients
   */
  async searchByIngredients(ingredients: string[]): Promise<IRecipes[]> {
    try {
      const recipes = await RecipeModel.find({
        ingredients: { $in: ingredients }
      }).lean();
      
      return recipes;
    } catch (error: any) {
      throw new ApiError(500, "Error searching recipes: " + error.message);
    }
  }

  /**
   * Get recipes by cooking time range
   */
  async getRecipesByCookingTime(minTime?: number, maxTime?: number): Promise<IRecipes[]> {
    try {
      let query: any = {};
      
      if (minTime !== undefined || maxTime !== undefined) {
        query.cookingTime = {};
        
        if (minTime !== undefined) {
          query.cookingTime.$gte = minTime;
        }
        
        if (maxTime !== undefined) {
          query.cookingTime.$lte = maxTime;
        }
      }
      
      const recipes = await RecipeModel.find(query).lean();
      return recipes;
    } catch (error: any) {
      throw new ApiError(500, "Error fetching recipes by cooking time: " + error.message);
    }
  }
}

export const recipesService = new RecipesService(); 