# Build image
docker build -t recipie-backend .

# Run container
docker run -p 3000:3000 recipie-backend