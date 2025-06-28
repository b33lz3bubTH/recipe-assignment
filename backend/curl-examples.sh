#!/bin/bash

# Recipe Assignment Backend - Curl Examples
# Make sure the server is running on http://localhost:3000

echo "🍽️  Recipe Assignment Backend - Authentication Testing"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000/api"

echo -e "\n${BLUE}1. Testing User Registration${NC}"
echo "----------------------------------------"

# Register a new user
echo -e "\n${GREEN}Registering user: john_doe${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }')

echo "Response:"
echo "$REGISTER_RESPONSE" | jq '.'

# Extract tokens from registration response
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken')
REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.refreshToken')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.id')

echo -e "\n${GREEN}Extracted tokens:${NC}"
echo "User ID: $USER_ID"
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:50}..."

echo -e "\n${BLUE}2. Testing User Login${NC}"
echo "----------------------------"

# Login with the same user
echo -e "\n${GREEN}Logging in user: john@example.com${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extract new tokens from login response
NEW_ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.accessToken')
NEW_REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.tokens.refreshToken')

echo -e "\n${GREEN}New tokens from login:${NC}"
echo "Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
echo "Refresh Token: ${NEW_REFRESH_TOKEN:0:50}..."

echo -e "\n${BLUE}3. Testing Protected Route${NC}"
echo "-----------------------------------"

# Test protected route with access token
echo -e "\n${GREEN}Accessing protected route with token${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN")

echo "Response:"
echo "$PROFILE_RESPONSE" | jq '.'

echo -e "\n${BLUE}4. Testing Token Verification${NC}"
echo "-------------------------------------"

# Verify token
echo -e "\n${GREEN}Verifying access token${NC}"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/verify" \
  -H "Content-Type: application/json" \
  -d "{
    \"token\": \"$NEW_ACCESS_TOKEN\"
  }")

echo "Response:"
echo "$VERIFY_RESPONSE" | jq '.'

echo -e "\n${BLUE}5. Testing Token Refresh${NC}"
echo "--------------------------------"

# Refresh token
echo -e "\n${GREEN}Refreshing access token${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$NEW_REFRESH_TOKEN\"
  }")

echo "Response:"
echo "$REFRESH_RESPONSE" | jq '.'

echo -e "\n${BLUE}6. Testing Error Cases${NC}"
echo "-------------------------------"

# Test invalid login
echo -e "\n${GREEN}Testing invalid login (wrong password)${NC}"
INVALID_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }')

echo "Response:"
echo "$INVALID_LOGIN_RESPONSE" | jq '.'

# Test duplicate registration
echo -e "\n${GREEN}Testing duplicate registration${NC}"
DUPLICATE_REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }')

echo "Response:"
echo "$DUPLICATE_REGISTER_RESPONSE" | jq '.'

# Test invalid email format
echo -e "\n${GREEN}Testing invalid email format${NC}"
INVALID_EMAIL_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "invalid-email",
    "password": "password123"
  }')

echo "Response:"
echo "$INVALID_EMAIL_RESPONSE" | jq '.'

# Test short password
echo -e "\n${GREEN}Testing short password${NC}"
SHORT_PASSWORD_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123"
  }')

echo "Response:"
echo "$SHORT_PASSWORD_RESPONSE" | jq '.'

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo -e "\n${BLUE}Quick Reference Commands:${NC}"
echo "--------------------------------"
echo "Register: curl -X POST $BASE_URL/auth/register -H 'Content-Type: application/json' -d '{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo "Login: curl -X POST $BASE_URL/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo "Profile: curl -X GET $BASE_URL/users/profile -H 'Authorization: Bearer YOUR_TOKEN'"
echo "Verify: curl -X POST $BASE_URL/auth/verify -H 'Content-Type: application/json' -d '{\"token\":\"YOUR_TOKEN\"}'"
echo "Refresh: curl -X POST $BASE_URL/auth/refresh -H 'Content-Type: application/json' -d '{\"refreshToken\":\"YOUR_REFRESH_TOKEN\"}'" 