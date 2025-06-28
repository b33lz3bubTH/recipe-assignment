# Recipe Assignment Backend API Documentation

This backend API provides authentication functionality using bcrypt for password hashing and JWT tokens for both login and registration.

## Features

- ✅ User registration with bcrypt password hashing
- ✅ User login with password verification
- ✅ JWT token generation for both registration and login
- ✅ Access token and refresh token system
- ✅ Token verification and refresh endpoints
- ✅ Protected routes with authentication middleware
- ✅ Input validation and error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
# Create a .env file with:
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MONGODB_URI=your-mongodb-connection-string
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

Register a new user with bcrypt password hashing and JWT token generation.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "username": "john_doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Validation Rules:**
- Username, email, and password are required
- Email must be in valid format
- Password must be at least 6 characters long
- Email and username must be unique

#### 2. Login User
**POST** `/api/auth/login`

Login user with password verification and JWT token generation.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "username": "john_doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 3. Refresh Token
**POST** `/api/auth/refresh`

Refresh the access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 4. Verify Token
**POST** `/api/auth/verify`

Verify if a token is valid and get the user payload.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Protected User Endpoints

#### 1. Get User Profile
**GET** `/api/users/profile`

Get the current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

#### 2. Update User Profile
**PUT** `/api/users/profile`

Update the current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "username": "new_username"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john@example.com",
    "username": "new_username"
  }
}
```

### Health Check

#### Health Check
**GET** `/health`

Check if the server is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Username, email, and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Passwords are never stored in plain text
- Password comparison is done securely using bcrypt.compare()

### JWT Token Security
- Access tokens expire in 24 hours
- Refresh tokens expire in 7 days
- Tokens are signed with a secret key
- Token verification includes expiration checks

### Input Validation
- Email format validation
- Password strength requirements (minimum 6 characters)
- Required field validation
- Unique email and username enforcement

## Usage Examples

### Registration Flow
1. User submits registration data
2. Server validates input
3. Server checks for existing users
4. Password is hashed with bcrypt
5. User is created in database
6. JWT tokens are generated and returned

### Login Flow
1. User submits login credentials
2. Server finds user by email
3. Password is verified using bcrypt.compare()
4. JWT tokens are generated and returned

### Protected Route Access
1. Client includes access token in Authorization header
2. Server verifies token using JWT
3. If valid, user data is attached to request
4. Route handler processes the request

### Token Refresh Flow
1. Client sends refresh token
2. Server verifies refresh token
3. If valid, new access and refresh tokens are generated
4. New tokens are returned to client

## Configuration

The application uses the following configuration (in `src/config/index.ts`):

```typescript
export const appConfig = {
    bcryptSaltRounds: 12,
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: '24h',
    jwtRefreshExpiresIn: '7d',
    mongoURI: process.env.MONGODB_URI || ''
}
```

## Testing the API

You can test the API using tools like Postman, curl, or any HTTP client:

### Example curl commands:

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Access protected route:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
``` 