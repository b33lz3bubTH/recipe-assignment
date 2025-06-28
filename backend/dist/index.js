"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongo_datasource_1 = require("./datasource/mongo.datasource");
const config_1 = require("./config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const recipes_routes_1 = __importDefault(require("./routes/recipes.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const celebrate_1 = require("celebrate");
async function startServer() {
    try {
        const app = (0, express_1.default)();
        const port = process.env.PORT || 3000;
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        // Routes
        app.use('/api/auth', auth_routes_1.default);
        app.use('/api/users', user_routes_1.default);
        app.use('/api/recipes', recipes_routes_1.default);
        app.use('/api/upload', upload_routes_1.default);
        app.get('/health-check', (req, res) => {
            res.json({ status: 'OK', message: 'Server is running' });
        });
        // Celebrate validation error handler
        app.use((0, celebrate_1.errors)());
        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Unhandled error:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
        app.listen(port, async () => {
            await new mongo_datasource_1.MongoDataSource(config_1.appConfig.mongoURI).init();
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
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
}
// Start the server
startServer();
