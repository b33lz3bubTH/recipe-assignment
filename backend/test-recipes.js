const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let accessToken = '';
let recipeId = '';

// Sample recipe data
const sampleRecipes = [
  {
    title: "Spaghetti Carbonara",
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale",
      "4 large eggs",
      "100g Pecorino Romano cheese",
      "100g Parmigiano-Reggiano",
      "Black pepper",
      "Salt"
    ],
    instructions: "Bring a large pot of salted water to boil. Cook spaghetti according to package directions. Meanwhile, cook pancetta in a large skillet until crispy. In a bowl, whisk together eggs, grated cheeses, and black pepper. Drain pasta, reserving 1 cup of pasta water. Add hot pasta to skillet with pancetta, remove from heat, and quickly stir in egg mixture. Add pasta water as needed to create a creamy sauce. Serve immediately with extra cheese and black pepper.",
    cookingTime: "25 minutes",
    imageUrl: "https://example.com/carbonara.jpg"
  },
  {
    title: "Chicken Tikka Masala",
    ingredients: [
      "500g chicken breast",
      "2 onions",
      "3 tomatoes",
      "2 tbsp tikka masala paste",
      "200ml coconut milk",
      "Fresh coriander",
      "Basmati rice"
    ],
    instructions: "Marinate chicken in tikka masala paste for 30 minutes. Cook chicken until golden brown. Sauté onions until soft, add tomatoes and cook until pulpy. Add coconut milk and simmer until sauce thickens. Add chicken back to pan and cook for 10 minutes. Garnish with fresh coriander and serve with basmati rice.",
    cookingTime: 45,
    imageUrl: "https://example.com/tikka-masala.jpg"
  },
  {
    title: "Chocolate Chip Cookies",
    ingredients: [
      "250g all-purpose flour",
      "200g butter",
      "150g brown sugar",
      "100g white sugar",
      "2 eggs",
      "1 tsp vanilla extract",
      "200g chocolate chips",
      "1/2 tsp baking soda"
    ],
    instructions: "Preheat oven to 350°F (175°C). Cream butter and sugars until light and fluffy. Beat in eggs and vanilla. Mix in flour and baking soda. Fold in chocolate chips. Drop rounded tablespoons onto baking sheet. Bake for 10-12 minutes until golden brown. Let cool on baking sheet for 5 minutes before transferring to wire rack.",
    cookingTime: "15 minutes",
    imageUrl: "https://example.com/cookies.jpg"
  }
];

// Helper function to log responses
const logResponse = (title, response) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ ${title}`);
  console.log(`${'='.repeat(50)}`);
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Helper function to log errors
const logError = (title, error) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`❌ ${title}`);
  console.log(`${'='.repeat(50)}`);
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.log('Error:', error.message);
  }
};

// Test functions
const testAuthentication = async () => {
  try {
    console.log('\n🔐 Testing Authentication...');
    
    // Register a test user
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'recipe_tester',
      email: 'recipe.tester@example.com',
      password: 'testpassword123'
    });
    
    accessToken = registerResponse.data.data.tokens.accessToken;
    logResponse('User Registration', registerResponse);
    
  } catch (error) {
    logError('Authentication Test', error);
  }
};

const testCreateRecipes = async () => {
  try {
    console.log('\n🍳 Testing Recipe Creation...');
    
    for (let i = 0; i < sampleRecipes.length; i++) {
      const recipe = sampleRecipes[i];
      const response = await axios.post(`${BASE_URL}/recipes`, recipe, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (i === 0) {
        recipeId = response.data.data.recipe._id;
      }
      
      // Verify user tracking fields
      const createdRecipe = response.data.data.recipe;
      console.log(`\n📝 User Tracking for "${recipe.title}":`);
      console.log(`   Created by: ${createdRecipe.createdBy}`);
      console.log(`   Updated by: ${createdRecipe.updatedBy}`);
      console.log(`   Created at: ${createdRecipe.createdAt}`);
      console.log(`   Updated at: ${createdRecipe.updatedAt}`);
      
      logResponse(`Created Recipe: ${recipe.title}`, response);
    }
    
  } catch (error) {
    logError('Recipe Creation Test', error);
  }
};

const testGetAllRecipes = async () => {
  try {
    console.log('\n📋 Testing Get All Recipes...');
    
    // Test basic get all
    const response1 = await axios.get(`${BASE_URL}/recipes`);
    logResponse('Get All Recipes (Basic)', response1);
    
    // Test with pagination
    const response2 = await axios.get(`${BASE_URL}/recipes?page=1&limit=2`);
    logResponse('Get All Recipes (Pagination)', response2);
    
    // Test with search
    const response3 = await axios.get(`${BASE_URL}/recipes?search=pasta`);
    logResponse('Get All Recipes (Search: pasta)', response3);
    
    // Test with sorting
    const response4 = await axios.get(`${BASE_URL}/recipes?sortBy=title&sortOrder=asc`);
    logResponse('Get All Recipes (Sorted by title ASC)', response4);
    
  } catch (error) {
    logError('Get All Recipes Test', error);
  }
};

const testGetRecipeById = async () => {
  try {
    console.log('\n🔍 Testing Get Recipe by ID...');
    
    const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`);
    logResponse('Get Recipe by ID', response);
    
  } catch (error) {
    logError('Get Recipe by ID Test', error);
  }
};

const testUpdateRecipe = async () => {
  try {
    console.log('\n✏️ Testing Update Recipe...');
    
    const updateData = {
      title: "Updated Spaghetti Carbonara",
      cookingTime: "30 minutes"
    };
    
    const response = await axios.put(`${BASE_URL}/recipes/${recipeId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Verify user tracking fields after update
    const updatedRecipe = response.data.data.recipe;
    console.log(`\n📝 User Tracking after Update:`);
    console.log(`   Created by: ${updatedRecipe.createdBy} (unchanged)`);
    console.log(`   Updated by: ${updatedRecipe.updatedBy} (should be recipe_tester)`);
    console.log(`   Created at: ${updatedRecipe.createdAt}`);
    console.log(`   Updated at: ${updatedRecipe.updatedAt}`);
    
    logResponse('Update Recipe', response);
    
  } catch (error) {
    logError('Update Recipe Test', error);
  }
};

const testUserTracking = async () => {
  try {
    console.log('\n👤 Testing User Tracking...');
    
    // Create a second user to test different user updates
    const secondUserResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'recipe_tester_2',
      email: 'recipe.tester2@example.com',
      password: 'testpassword123'
    });
    
    const secondUserToken = secondUserResponse.data.data.tokens.accessToken;
    
    // Update recipe with second user
    const updateData = {
      title: "Updated by Second User",
      cookingTime: "35 minutes"
    };
    
    const response = await axios.put(`${BASE_URL}/recipes/${recipeId}`, updateData, {
      headers: {
        'Authorization': `Bearer ${secondUserToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Verify user tracking fields
    const updatedRecipe = response.data.data.recipe;
    console.log(`\n📝 User Tracking with Different User:`);
    console.log(`   Created by: ${updatedRecipe.createdBy} (should be recipe_tester)`);
    console.log(`   Updated by: ${updatedRecipe.updatedBy} (should be recipe_tester_2)`);
    console.log(`   Created at: ${updatedRecipe.createdAt}`);
    console.log(`   Updated at: ${updatedRecipe.updatedAt}`);
    
    logResponse('Update Recipe with Second User', response);
    
  } catch (error) {
    logError('User Tracking Test', error);
  }
};

const testSearchByIngredients = async () => {
  try {
    console.log('\n🔍 Testing Search by Ingredients...');
    
    const response = await axios.get(`${BASE_URL}/recipes/search/ingredients?ingredients=pasta,eggs,cheese`);
    logResponse('Search by Ingredients (pasta,eggs,cheese)', response);
    
  } catch (error) {
    logError('Search by Ingredients Test', error);
  }
};

const testSearchByCookingTime = async () => {
  try {
    console.log('\n⏰ Testing Search by Cooking Time...');
    
    const response = await axios.get(`${BASE_URL}/recipes/search/cooking-time?minTime=20&maxTime=50`);
    logResponse('Search by Cooking Time (20-50 minutes)', response);
    
  } catch (error) {
    logError('Search by Cooking Time Test', error);
  }
};

const testErrorCases = async () => {
  try {
    console.log('\n🚫 Testing Error Cases...');
    
    // Test creating recipe without authentication
    try {
      await axios.post(`${BASE_URL}/recipes`, sampleRecipes[0]);
    } catch (error) {
      logResponse('Create Recipe without Auth (Expected Error)', error.response);
    }
    
    // Test creating recipe with invalid data
    try {
      await axios.post(`${BASE_URL}/recipes`, {
        title: "", // Invalid: empty title
        ingredients: [], // Invalid: empty ingredients
        instructions: "Short", // Invalid: too short
        cookingTime: -5 // Invalid: negative number
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      logResponse('Create Recipe with Invalid Data (Expected Error)', error.response);
    }
    
    // Test getting non-existent recipe
    try {
      await axios.get(`${BASE_URL}/recipes/507f1f77bcf86cd799439011`);
    } catch (error) {
      logResponse('Get Non-existent Recipe (Expected Error)', error.response);
    }
    
  } catch (error) {
    logError('Error Cases Test', error);
  }
};

const testDeleteRecipe = async () => {
  try {
    console.log('\n🗑️ Testing Delete Recipe...');
    
    const response = await axios.delete(`${BASE_URL}/recipes/${recipeId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    logResponse('Delete Recipe', response);
    
  } catch (error) {
    logError('Delete Recipe Test', error);
  }
};

// Main test runner
const runTests = async () => {
  console.log('🍽️ Recipe API Testing Suite');
  console.log('============================');
  
  try {
    await testAuthentication();
    await testCreateRecipes();
    await testGetAllRecipes();
    await testGetRecipeById();
    await testUpdateRecipe();
    await testUserTracking();
    await testSearchByIngredients();
    await testSearchByCookingTime();
    await testErrorCases();
    await testDeleteRecipe();
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
  }
};

// Run the tests
runTests(); 