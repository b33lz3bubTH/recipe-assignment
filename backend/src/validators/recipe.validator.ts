import Joi from "joi";

export const createRecipeSchema = {
  body: Joi.object({
    title: Joi.string().required().trim().min(1).max(200).messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title cannot exceed 200 characters",
    }),
    ingredients: Joi.array().items(Joi.string().trim().min(1)).min(1).required().messages({
      "array.min": "At least one ingredient is required",
      "array.base": "Ingredients must be an array",
    }),
    instructions: Joi.string().required().trim().min(10).max(5000).messages({
      "string.empty": "Instructions are required",
      "string.min": "Instructions must be at least 10 characters long",
      "string.max": "Instructions cannot exceed 5000 characters",
    }),
    cookingTime: Joi.alternatives().try(
      Joi.string().trim().min(1).max(50),
      Joi.number().positive().integer()
    ).required().messages({
      "alternatives.any": "Cooking time must be a string or positive number",
    }),
    imageUrl: Joi.string().optional().allow("").messages({
      "string.uri": "Image URL must be a valid URL",
    }),
  }).unknown(true),
};

export const updateRecipeSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(1).max(200).optional().messages({
      "string.min": "Title must be at least 1 character long",
      "string.max": "Title cannot exceed 200 characters",
    }),
    ingredients: Joi.array().items(Joi.string().trim().min(1)).min(1).optional().messages({
      "array.min": "At least one ingredient is required",
      "array.base": "Ingredients must be an array",
    }),
    instructions: Joi.string().trim().min(10).max(5000).optional().messages({
      "string.min": "Instructions must be at least 10 characters long",
      "string.max": "Instructions cannot exceed 5000 characters",
    }),
    cookingTime: Joi.alternatives().try(
      Joi.string().trim().min(1).max(50),
      Joi.number().positive().integer()
    ).optional().messages({
      "alternatives.any": "Cooking time must be a string or positive number",
    }),
    imageUrl: Joi.string().optional().allow("").messages({
      "string.uri": "Image URL must be a valid URL",
    }),
    _id: Joi.string().optional().allow("").messages({
    }),
  }).unknown(true),
};

export const getRecipesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().optional(),
    sortBy: Joi.string().valid("title", "cookingTime", "createdAt", "updatedAt").default("createdAt"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  }),
};

export const getRecipeByIdSchema = {
  params: Joi.object({
    id: Joi.string().required().messages({
      "string.empty": "Recipe ID is required",
    }),
  }),
};

export const deleteRecipeSchema = {
  params: Joi.object({
    id: Joi.string().required().messages({
      "string.empty": "Recipe ID is required",
    }),
  }),
};

export const searchByIngredientsSchema = {
  query: Joi.object({
    ingredients: Joi.string().required().messages({
      "string.empty": "Ingredients parameter is required",
    }),
  }),
};

export const getRecipesByCookingTimeSchema = {
  query: Joi.object({
    minTime: Joi.number().positive().integer().optional(),
    maxTime: Joi.number().positive().integer().optional(),
  }).custom((value, helpers) => {
    if (value.minTime && value.maxTime && value.minTime > value.maxTime) {
      return helpers.error("any.invalid", { message: "minTime cannot be greater than maxTime" });
    }
    return value;
  }),
}; 