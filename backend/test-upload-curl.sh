#!/bin/bash

# Upload API Testing with curl
# Make sure the server is running on http://localhost:3000

echo "📤 Upload API Testing with curl"
echo "==============================="

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

# Create a test image file
create_test_image() {
    local test_image_path="test-image.png"
    
    # Create a simple 1x1 PNG image using base64
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "$test_image_path"
    
    echo "$test_image_path"
}

print_section "1. Create Test Image"

# Create test image
TEST_IMAGE_PATH=$(create_test_image)
print_success "Created test image: $TEST_IMAGE_PATH"

print_section "2. Upload Image"

# Upload image
echo -e "\n${GREEN}Uploading test image...${NC}"
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/upload/image" \
  -F "file=@$TEST_IMAGE_PATH")

echo "Upload Response:"
echo "$UPLOAD_RESPONSE" | jq '.'

# Extract filename
FILENAME=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.filename')
if [ "$FILENAME" = "null" ] || [ -z "$FILENAME" ]; then
    print_error "Failed to get filename from upload response"
    exit 1
fi

print_success "Image uploaded with filename: $FILENAME"

print_section "3. Serve Uploaded File"

# Serve the uploaded file
echo -e "\n${GREEN}Serving uploaded file...${NC}"
SERVE_RESPONSE=$(curl -s -I "$BASE_URL/upload/file?file=$FILENAME")

echo "Serve File Response Headers:"
echo "$SERVE_RESPONSE"

# Download the file to verify it works
echo -e "\n${GREEN}Downloading file to verify...${NC}"
curl -s -o "downloaded-$FILENAME" "$BASE_URL/upload/file?file=$FILENAME"

if [ -f "downloaded-$FILENAME" ]; then
    print_success "File downloaded successfully: downloaded-$FILENAME"
    echo "File size: $(stat -c%s "downloaded-$FILENAME") bytes"
else
    print_error "Failed to download file"
fi

print_section "4. Get Uploaded Files List"

# Get list of uploaded files
echo -e "\n${GREEN}Getting list of uploaded files...${NC}"
FILES_RESPONSE=$(curl -s -X GET "$BASE_URL/upload/files")

echo "Files List Response:"
echo "$FILES_RESPONSE" | jq '.'

print_section "5. Error Cases"

# Test uploading without file
echo -e "\n${GREEN}Testing upload without file (expected error)...${NC}"
NO_FILE_RESPONSE=$(curl -s -X POST "$BASE_URL/upload/image")
echo "Upload without file Response:"
echo "$NO_FILE_RESPONSE" | jq '.'

# Test uploading invalid file type
echo -e "\n${GREEN}Testing upload with invalid file type (expected error)...${NC}"
echo "This is a text file, not an image" > test.txt
INVALID_FILE_RESPONSE=$(curl -s -X POST "$BASE_URL/upload/image" \
  -F "file=@test.txt")
echo "Upload invalid file type Response:"
echo "$INVALID_FILE_RESPONSE" | jq '.'

# Test serving non-existent file
echo -e "\n${GREEN}Testing serve non-existent file (expected error)...${NC}"
NOT_FOUND_RESPONSE=$(curl -s -X GET "$BASE_URL/upload/file?file=nonexistent.jpg")
echo "Serve non-existent file Response:"
echo "$NOT_FOUND_RESPONSE" | jq '.'

# Test serving without file parameter
echo -e "\n${GREEN}Testing serve without file parameter (expected error)...${NC}"
NO_PARAM_RESPONSE=$(curl -s -X GET "$BASE_URL/upload/file")
echo "Serve without file parameter Response:"
echo "$NO_PARAM_RESPONSE" | jq '.'

print_section "6. Cleanup"

# Clean up test files
rm -f "$TEST_IMAGE_PATH" "test.txt" "downloaded-$FILENAME"
print_success "Cleaned up test files"

echo -e "\n${GREEN}🎉 Upload API testing completed!${NC}"

echo -e "\n${BLUE}Quick Reference Commands:${NC}"
echo "--------------------------------"
echo "Upload Image: curl -X POST $BASE_URL/upload/image -F 'file=@your-image.jpg'"
echo "Serve File: curl -X GET '$BASE_URL/upload/file?file=FILENAME'"
echo "List Files: curl -X GET $BASE_URL/upload/files"

echo -e "\n${YELLOW}📝 Upload Notes:${NC}"
echo "   - Supported formats: JPEG, JPG, PNG"
echo "   - Maximum file size: 5MB"
echo "   - Files are stored with UUID names"
echo "   - Original file extension is preserved"
echo "   - Files are stored in the 'uploads' directory" 