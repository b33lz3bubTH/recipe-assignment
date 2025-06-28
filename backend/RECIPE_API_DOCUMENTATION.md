# Recipe API Documentation

## Overview
The Recipe API provides comprehensive CRUD operations for managing recipes, including search functionality and authentication-protected endpoints. User tracking is automatically handled through JWT authentication.

## Base URL
```
http://localhost:3000/api/recipes
```

## Authentication
Protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

**Note:** The `createdBy` and `updatedBy` fields are automatically populated from the JWT payload (username) and cannot be manually set in the request body.

## Endpoints

### 1. Create Recipe
**POST** `/api/recipes`

Creates a new recipe (requires authentication). The `createdBy` and `updatedBy` fields are automatically set to the authenticated user's username.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Spaghetti Carbonara",
  "ingredients": [
    "400g spaghetti",
    "200g pancetta or guanciale",
    "4 large eggs",
    "100g Pecorino Romano cheese",
    "100g Parmigiano-Reggiano",
    "Black pepper",
    "Salt"
  ],
  "instructions": "Bring a large pot of salted water to boil. Cook spaghetti according to package directions. Meanwhile, cook pancetta in a large skillet until crispy. In a bowl, whisk together eggs, grated cheeses, and black pepper. Drain pasta, reserving 1 cup of pasta water. Add hot pasta to skillet with pancetta, remove from heat, and quickly stir in egg mixture. Add pasta water as needed to create a creamy sauce. Serve immediately with extra cheese and black pepper.",
  "cookingTime": "25 minutes",
  "imageUrl": "https://example.com/carbonara.jpg"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "recipe": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Spaghetti Carbonara",
      "ingredients": ["400g spaghetti", "200g pancetta or guanciale", "4 large eggs", "100g Pecorino Romano cheese", "100g Parmigiano-Reggiano", "Black pepper", "Salt"],
      "instructions": "Bring a large pot of salted water to boil...",
      "cookingTime": "25 minutes",
      "imageUrl": "https://example.com/carbonara.jpg",
      "createdBy": "john_doe",
      "updatedBy": "john_doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe created successfully",
  "success": true
}
```

### 2. Get All Recipes
**GET** `/api/recipes`

Retrieves all recipes with pagination and search capabilities (public endpoint).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for title, ingredients, or instructions
- `sortBy` (optional): Sort field (title, cookingTime, createdAt, updatedAt)
- `sortOrder` (optional): Sort direction (asc, desc)

**Example Request:**
```
GET /api/recipes?page=1&limit=5&search=pasta&sortBy=title&sortOrder=asc
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "recipes": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Spaghetti Carbonara",
        "ingredients": ["400g spaghetti", "200g pancetta"],
        "instructions": "Bring a large pot of salted water to boil...",
        "cookingTime": "25 minutes",
        "imageUrl": "https://example.com/carbonara.jpg",
        "createdBy": "john_doe",
        "updatedBy": "john_doe",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "totalPages": 1
  },
  "message": "Recipes retrieved successfully",
  "success": true
}
```

### 3. Get Recipe by ID
**GET** `/api/recipes/:id`

Retrieves a specific recipe by its ID (public endpoint).

**Example Request:**
```
GET /api/recipes/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "recipe": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Spaghetti Carbonara",
      "ingredients": ["400g spaghetti", "200g pancetta"],
      "instructions": "Bring a large pot of salted water to boil...",
      "cookingTime": "25 minutes",
      "imageUrl": "https://example.com/carbonara.jpg",
      "createdBy": "john_doe",
      "updatedBy": "john_doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Recipe retrieved successfully",
  "success": true
}
```

### 4. Update Recipe
**PUT** `/api/recipes/:id`

Updates an existing recipe (requires authentication). The `updatedBy` field is automatically set to the authenticated user's username.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Spaghetti Carbonara",
  "cookingTime": "30 minutes"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "recipe": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Updated Spaghetti Carbonara",
      "ingredients": ["400g spaghetti", "200g pancetta"],
      "instructions": "Bring a large pot of salted water to boil...",
      "cookingTime": "30 minutes",
      "imageUrl": "https://example.com/carbonara.jpg",
      "createdBy": "john_doe",
      "updatedBy": "jane_smith",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  },
  "message": "Recipe updated successfully",
  "success": true
}
```

### 5. Delete Recipe
**DELETE** `/api/recipes/:id`

Deletes a recipe (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Example Request:**
```
DELETE /api/recipes/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Recipe deleted successfully",
  "success": true
}
```

### 6. Search by Ingredients
**GET** `/api/recipes/search/ingredients`

Searches for recipes that contain specific ingredients (public endpoint).

**Query Parameters:**
- `ingredients` (required): Comma-separated list of ingredients

**Example Request:**
```
GET /api/recipes/search/ingredients?ingredients=pasta,eggs,cheese
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "recipes": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Spaghetti Carbonara",
        "ingredients": ["400g spaghetti", "4 large eggs", "100g Pecorino Romano cheese"],
        "instructions": "Bring a large pot of salted water to boil...",
        "cookingTime": "25 minutes",
        "imageUrl": "https://example.com/carbonara.jpg",
        "createdBy": "john_doe",
        "updatedBy": "john_doe",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 1
  },
  "message": "Recipes found successfully",
  "success": true
}
```

### 7. Search by Cooking Time
**GET** `/api/recipes/search/cooking-time`

Searches for recipes within a specific cooking time range (public endpoint).

**Query Parameters:**
- `minTime` (optional): Minimum cooking time in minutes
- `maxTime` (optional): Maximum cooking time in minutes

**Example Request:**
```
GET /api/recipes/search/cooking-time?minTime=20&maxTime=45
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "recipes": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Spaghetti Carbonara",
        "ingredients": ["400g spaghetti", "200g pancetta"],
        "instructions": "Bring a large pot of salted water to boil...",
        "cookingTime": "25 minutes",
        "imageUrl": "https://example.com/carbonara.jpg",
        "createdBy": "john_doe",
        "updatedBy": "john_doe",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "count": 1
  },
  "message": "Recipes found successfully",
  "success": true
}
```

## Data Models

### Recipe Entity
```typescript
interface Recipe {
  _id: string;
  title: string;           // Required, 1-200 characters
  ingredients: string[];   // Required, array of strings, at least 1 ingredient
  instructions: string;    // Required, 10-5000 characters
  cookingTime: string | number; // Required, string or positive number
  imageUrl?: string;       // Optional, valid URL
  createdBy: string;       // Auto-populated from JWT payload (username)
  updatedBy: string;       // Auto-populated from JWT payload (username)
  createdAt: Date;         // Auto-generated timestamp
  updatedAt: Date;         // Auto-updated timestamp
}
```

## User Tracking

The API automatically tracks user actions through JWT authentication:

- **createdBy**: Set to the authenticated user's username when creating a recipe
- **updatedBy**: Set to the authenticated user's username when updating a recipe
- **createdAt**: Automatically set when creating a recipe
- **updatedAt**: Automatically updated when modifying a recipe

These fields cannot be manually set in the request body and are automatically populated from the JWT token payload.

## Error Responses

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "statusCode": 401,
  "message": "Access token is required"
}
```

### User Information Error (401)
```json
{
  "statusCode": 401,
  "message": "User information not found"
}
```

### Not Found Error (404)
```json
{
  "statusCode": 404,
  "message": "Recipe not found"
}
```

### Conflict Error (409)
```json
{
  "statusCode": 409,
  "message": "Recipe with this title already exists"
}
```

### Server Error (500)
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Testing Examples

### Using curl

1. **Create a recipe:**
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Chicken Curry",
    "ingredients": ["chicken", "onions", "tomatoes", "spices"],
    "instructions": "Cook chicken with spices and vegetables...",
    "cookingTime": "45 minutes",
    "imageUrl": "https://example.com/curry.jpg"
  }'
```

2. **Get all recipes:**
```bash
curl -X GET "http://localhost:3000/api/recipes?page=1&limit=5"
```

3. **Search by ingredients:**
```bash
curl -X GET "http://localhost:3000/api/recipes/search/ingredients?ingredients=chicken,onions"
```

4. **Update a recipe:**
```bash
curl -X PUT http://localhost:3000/api/recipes/RECIPE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Chicken Curry"
  }'
```

5. **Delete a recipe:**
```bash
curl -X DELETE http://localhost:3000/api/recipes/RECIPE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Notes

- All timestamps are in ISO 8601 format
- The search functionality uses MongoDB's text search capabilities
- Pagination is zero-based internally but one-based in the API
- Cooking time can be either a string (e.g., "30 minutes") or a number (representing minutes)
- Image URLs are validated for proper URL format
- Protected endpoints require a valid JWT token obtained from the authentication endpoints
- User tracking fields (`createdBy`, `updatedBy`) are automatically populated from JWT payload
- The `createdBy` field remains unchanged after creation, while `updatedBy` is updated on each modification 