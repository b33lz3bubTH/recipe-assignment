#!/bin/bash

# Recipe API Testing with curl
# Make sure the server is running on http://localhost:3000

echo "🍽️ Recipe API Testing with curl"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}$1${NC}"
    echo "----------------------------------------"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${YELLOW}ℹ️ $1${NC}"
}

print_section "1. Authentication Setup"

# Register a test user and get access token
echo -e "\n${GREEN}Registering test user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "recipe_tester",
    "email": "recipe.tester@example.com",
    "password": "testpassword123"
  }')

echo "Registration Response:"
echo "$REGISTER_RESPONSE" | jq '.'

# Extract access token
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken')
if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
    print_error "Failed to get access token"
    exit 1
fi

print_success "Access token obtained: ${ACCESS_TOKEN:0:50}..."

print_section "2. Create Recipe"

# Create a recipe
echo -e "\n${GREEN}Creating a new recipe...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
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
  }')

echo "Create Recipe Response:"
echo "$CREATE_RESPONSE" | jq '.'

# Extract recipe ID
RECIPE_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.recipe._id')
if [ "$RECIPE_ID" = "null" ] || [ -z "$RECIPE_ID" ]; then
    print_error "Failed to get recipe ID"
    exit 1
fi

# Show user tracking information
CREATED_BY=$(echo "$CREATE_RESPONSE" | jq -r '.data.recipe.createdBy')
UPDATED_BY=$(echo "$CREATE_RESPONSE" | jq -r '.data.recipe.updatedBy')
CREATED_AT=$(echo "$CREATE_RESPONSE" | jq -r '.data.recipe.createdAt')
UPDATED_AT=$(echo "$CREATE_RESPONSE" | jq -r '.data.recipe.updatedAt')

echo -e "\n${YELLOW}📝 User Tracking Information:${NC}"
echo "   Created by: $CREATED_BY"
echo "   Updated by: $UPDATED_BY"
echo "   Created at: $CREATED_AT"
echo "   Updated at: $UPDATED_AT"

print_success "Recipe created with ID: $RECIPE_ID"

print_section "3. Get All Recipes"

# Get all recipes
echo -e "\n${GREEN}Getting all recipes...${NC}"
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes")
echo "Get All Recipes Response:"
echo "$GET_ALL_RESPONSE" | jq '.'

# Get recipes with pagination
echo -e "\n${GREEN}Getting recipes with pagination...${NC}"
GET_PAGINATED_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes?page=1&limit=5")
echo "Get Recipes with Pagination Response:"
echo "$GET_PAGINATED_RESPONSE" | jq '.'

# Get recipes with search
echo -e "\n${GREEN}Searching recipes for 'pasta'...${NC}"
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes?search=pasta")
echo "Search Recipes Response:"
echo "$SEARCH_RESPONSE" | jq '.'

print_section "4. Get Recipe by ID"

# Get specific recipe
echo -e "\n${GREEN}Getting recipe by ID...${NC}"
GET_BY_ID_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes/$RECIPE_ID")
echo "Get Recipe by ID Response:"
echo "$GET_BY_ID_RESPONSE" | jq '.'

print_section "5. Update Recipe"

# Update recipe
echo -e "\n${GREEN}Updating recipe...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/recipes/$RECIPE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Updated Spaghetti Carbonara",
    "cookingTime": "30 minutes"
  }')

echo "Update Recipe Response:"
echo "$UPDATE_RESPONSE" | jq '.'

# Show user tracking information after update
UPDATED_BY_AFTER=$(echo "$UPDATE_RESPONSE" | jq -r '.data.recipe.updatedBy')
UPDATED_AT_AFTER=$(echo "$UPDATE_RESPONSE" | jq -r '.data.recipe.updatedAt')

echo -e "\n${YELLOW}📝 User Tracking after Update:${NC}"
echo "   Created by: $CREATED_BY (unchanged)"
echo "   Updated by: $UPDATED_BY_AFTER (should be recipe_tester)"
echo "   Created at: $CREATED_AT"
echo "   Updated at: $UPDATED_AT_AFTER"

print_section "6. Test User Tracking with Different User"

# Register a second user
echo -e "\n${GREEN}Registering second test user...${NC}"
SECOND_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "recipe_tester_2",
    "email": "recipe.tester2@example.com",
    "password": "testpassword123"
  }')

echo "Second User Registration Response:"
echo "$SECOND_USER_RESPONSE" | jq '.'

# Extract second user access token
SECOND_USER_TOKEN=$(echo "$SECOND_USER_RESPONSE" | jq -r '.data.tokens.accessToken')
if [ "$SECOND_USER_TOKEN" = "null" ] || [ -z "$SECOND_USER_TOKEN" ]; then
    print_error "Failed to get second user access token"
    exit 1
fi

# Update recipe with second user
echo -e "\n${GREEN}Updating recipe with second user...${NC}"
SECOND_USER_UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/recipes/$RECIPE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SECOND_USER_TOKEN" \
  -d '{
    "title": "Updated by Second User",
    "cookingTime": "35 minutes"
  }')

echo "Second User Update Response:"
echo "$SECOND_USER_UPDATE_RESPONSE" | jq '.'

# Show user tracking information with different user
UPDATED_BY_SECOND=$(echo "$SECOND_USER_UPDATE_RESPONSE" | jq -r '.data.recipe.updatedBy')
UPDATED_AT_SECOND=$(echo "$SECOND_USER_UPDATE_RESPONSE" | jq -r '.data.recipe.updatedAt')

echo -e "\n${YELLOW}📝 User Tracking with Different User:${NC}"
echo "   Created by: $CREATED_BY (should be recipe_tester)"
echo "   Updated by: $UPDATED_BY_SECOND (should be recipe_tester_2)"
echo "   Created at: $CREATED_AT"
echo "   Updated at: $UPDATED_AT_SECOND"

print_section "7. Search by Ingredients"

# Search by ingredients
echo -e "\n${GREEN}Searching recipes by ingredients...${NC}"
INGREDIENTS_SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes/search/ingredients?ingredients=pasta,eggs,cheese")
echo "Search by Ingredients Response:"
echo "$INGREDIENTS_SEARCH_RESPONSE" | jq '.'

print_section "8. Search by Cooking Time"

# Search by cooking time
echo -e "\n${GREEN}Searching recipes by cooking time...${NC}"
TIME_SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes/search/cooking-time?minTime=20&maxTime=50")
echo "Search by Cooking Time Response:"
echo "$TIME_SEARCH_RESPONSE" | jq '.'

print_section "9. Error Cases"

# Test creating recipe without authentication
echo -e "\n${GREEN}Testing create recipe without authentication (expected error)...${NC}"
NO_AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Recipe",
    "ingredients": ["test"],
    "instructions": "Test instructions",
    "cookingTime": "10 minutes"
  }')

echo "Create Recipe without Auth Response:"
echo "$NO_AUTH_RESPONSE" | jq '.'

# Test creating recipe with invalid data
echo -e "\n${GREEN}Testing create recipe with invalid data (expected error)...${NC}"
INVALID_DATA_RESPONSE=$(curl -s -X POST "$BASE_URL/recipes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "",
    "ingredients": [],
    "instructions": "Short",
    "cookingTime": -5
  }')

echo "Create Recipe with Invalid Data Response:"
echo "$INVALID_DATA_RESPONSE" | jq '.'

# Test getting non-existent recipe
echo -e "\n${GREEN}Testing get non-existent recipe (expected error)...${NC}"
NOT_FOUND_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes/507f1f77bcf86cd799439011")
echo "Get Non-existent Recipe Response:"
echo "$NOT_FOUND_RESPONSE" | jq '.'

print_section "10. Delete Recipe"

# Delete recipe
echo -e "\n${GREEN}Deleting recipe...${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/recipes/$RECIPE_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Delete Recipe Response:"
echo "$DELETE_RESPONSE" | jq '.'

print_section "11. Verify Deletion"

# Verify recipe is deleted
echo -e "\n${GREEN}Verifying recipe deletion...${NC}"
VERIFY_DELETE_RESPONSE=$(curl -s -X GET "$BASE_URL/recipes/$RECIPE_ID")
echo "Verify Deletion Response:"
echo "$VERIFY_DELETE_RESPONSE" | jq '.'

echo -e "\n${GREEN}🎉 Recipe API testing completed!${NC}"

echo -e "\n${BLUE}Quick Reference Commands:${NC}"
echo "--------------------------------"
echo "Create Recipe: curl -X POST $BASE_URL/recipes -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -d '{\"title\":\"Recipe\",\"ingredients\":[\"ingredient\"],\"instructions\":\"instructions\",\"cookingTime\":\"30 minutes\"}'"
echo "Get All: curl -X GET '$BASE_URL/recipes?page=1&limit=10'"
echo "Get by ID: curl -X GET $BASE_URL/recipes/RECIPE_ID"
echo "Update: curl -X PUT $BASE_URL/recipes/RECIPE_ID -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_TOKEN' -d '{\"title\":\"Updated Title\"}'"
echo "Delete: curl -X DELETE $BASE_URL/recipes/RECIPE_ID -H 'Authorization: Bearer YOUR_TOKEN'"
echo "Search Ingredients: curl -X GET '$BASE_URL/recipes/search/ingredients?ingredients=pasta,eggs'"
echo "Search Time: curl -X GET '$BASE_URL/recipes/search/cooking-time?minTime=20&maxTime=60'"

echo -e "\n${YELLOW}📝 User Tracking Notes:${NC}"
echo "   - createdBy and updatedBy are automatically populated from JWT payload"
echo "   - createdBy remains unchanged after creation"
echo "   - updatedBy changes to the current user on each update"
echo "   - These fields cannot be manually set in request body" 