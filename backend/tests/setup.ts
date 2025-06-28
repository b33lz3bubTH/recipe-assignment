// Jest setup file
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(30000); 