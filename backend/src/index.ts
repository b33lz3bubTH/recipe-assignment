import express from 'express';
import cors from 'cors';
import { MongoDataSource } from './datasource/mongo.datasource';
import { appConfig } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recipeRoutes from './routes/recipes.routes';
import uploadRoutes from './routes/upload.routes';
import { errors as celebrateErrors } from 'celebrate';

async function startServer() {
  try {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    app.use(cors());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/upload', uploadRoutes);

    app.get('/health-check', (req, res) => {
      res.json({ status: 'OK', message: 'Server is running' });
    });

    // Celebrate validation error handler
    app.use(celebrateErrors());

    // Error handling middleware
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    });

    app.listen(port, async () => {
      await new MongoDataSource(appConfig.mongoURI).init();
      console.log(`🚀 Server ready at http://localhost:${port}`);
      // console.log(`📝 API Documentation:`);
      // console.log(`   POST /api/auth/register - Register a new user`);
      // console.log(`   POST /api/auth/login - Login user`);
      // console.log(`   POST /api/auth/refresh - Refresh access token`);
      // console.log(`   POST /api/auth/verify - Verify token`);
      // console.log(`   GET /api/users/profile - Get user profile (protected)`);
      // console.log(`   PUT /api/users/profile - Update user profile (protected)`);
      // console.log(`   GET /api/recipes - Get all recipes (public)`);
      // console.log(`   POST /api/recipes - Create recipe (protected)`);
      // console.log(`   GET /api/recipes/:id - Get recipe by ID (public)`);
      // console.log(`   PUT /api/recipes/:id - Update recipe (protected)`);
      // console.log(`   DELETE /api/recipes/:id - Delete recipe (protected)`);
      // console.log(`   GET /api/recipes/search/ingredients - Search by ingredients (public)`);
      // console.log(`   GET /api/recipes/search/cooking-time - Search by cooking time (public)`);
      // console.log(`   POST /api/upload/image - Upload image file (public)`);
      // console.log(`   GET /api/upload/file?file=filename - Serve uploaded file (public)`);
      // console.log(`   GET /api/upload/files - List uploaded files (public)`);
      // console.log(`   GET /health-check - Health check`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Start the server
startServer();