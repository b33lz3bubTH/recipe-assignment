import { Schema, model } from "mongoose";
import { IBaseDocument, baseSchemaFields } from "./base";
import { SchemaFields } from "./collections";
import { ModelRefs } from "./collections";

interface RecipesEntity {
  title: string;
  ingredients: string[];
  instructions: string;
  cookingTime: string | number;
  imageUrl?: string;
  createdBy: string;
  updatedBy: string;
}

interface IRecipes extends IBaseDocument, RecipesEntity {}

const schemaFields: SchemaFields<RecipesEntity> = {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
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
    type: Schema.Types.Mixed, // Can be String or Number
    required: true,
    validate: {
      validator: function(v: string | number) {
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

const schema = new Schema<IRecipes>({
  ...baseSchemaFields,
  ...schemaFields,
});

schema.index(
  {
    title: "text",
    ingredients: "text",
    instructions: "text",
  },
  {
    name: "Recipes_search_index",
    weights: {
      title: 10,
      ingredients: 5,
      instructions: 3,
    },
  }
);

export const RecipeModel = model<IRecipes>(ModelRefs.Recipes, schema);

export { IRecipes, RecipesEntity };