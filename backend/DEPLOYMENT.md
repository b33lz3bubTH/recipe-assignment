# Recipe Backend Deployment Guide

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- MongoDB instance (local or cloud)
- Environment variables configured

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/recipe-app

# JWT Secrets (generate strong secrets for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Deployment Steps

1. **Build and start the service:**
   ```bash
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Test the health endpoint:**
   ```bash
   curl http://localhost:3000/health-check
   ```

### Manual Docker Commands

If you prefer to use Docker directly:

1. **Build the image:**
   ```bash
   docker build -t recipe-backend .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name recipe-backend \
     -p 3000:3000 \
     -e MONGO_URI=mongodb://localhost:27017/recipe-app \
     -e JWT_SECRET=your-secret-key \
     -e JWT_REFRESH_SECRET=your-refresh-secret \
     -v $(pwd)/uploads:/app/uploads \
     recipe-backend
   ```

### Troubleshooting

#### Common Issues

1. **"Cannot find module 'cors'" error:**
   - This was fixed by moving `cors` to `dependencies` in package.json
   - Ensure you're using the updated package.json

2. **MongoDB connection issues:**
   - Verify your MongoDB instance is running
   - Check the MONGO_URI environment variable
   - Ensure network connectivity between container and MongoDB

3. **Upload directory permissions:**
   - The container creates an `uploads` directory
   - Ensure proper permissions for file uploads

4. **Port conflicts:**
   - Change the port mapping in docker-compose.yml if 3000 is already in use
   - Example: `"3001:3000"` to use port 3001 on host

#### Health Check

The container includes a health check that verifies the application is responding:

```bash
# Check container health
docker ps

# View health check logs
docker inspect recipe-backend | grep -A 10 "Health"
```

#### Logs and Debugging

```bash
# View application logs
docker logs recipe-backend

# Follow logs in real-time
docker logs -f recipe-backend

# Access container shell for debugging
docker exec -it recipe-backend sh
```

### Production Considerations

1. **Environment Variables:**
   - Use strong, unique JWT secrets
   - Use environment-specific MongoDB URIs
   - Consider using Docker secrets for sensitive data

2. **Security:**
   - Run container as non-root user
   - Use specific port mappings
   - Implement proper firewall rules

3. **Monitoring:**
   - Set up log aggregation
   - Monitor container health
   - Set up alerts for failures

4. **Backup:**
   - Backup MongoDB data
   - Backup uploaded files in the uploads directory

### API Endpoints

Once deployed, the following endpoints will be available:

- `GET /health-check` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/upload/image` - Image upload
- `GET /api/upload/file?file=filename` - Serve uploaded files
- `GET /api/recipes` - Get recipes
- And more...

### Stopping the Service

```bash
# Stop with docker-compose
docker-compose down

# Stop with Docker
docker stop recipe-backend
docker rm recipe-backend
``` 