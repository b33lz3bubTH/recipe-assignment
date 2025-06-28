# Upload API Documentation

## Overview
The Upload API provides functionality for uploading and serving image files. It uses multer for file handling and generates unique UUID filenames for security.

## Base URL
```
http://localhost:3000/api/upload
```

## Features
- ✅ **Image Upload**: Support for JPEG, JPG, and PNG files
- ✅ **UUID Naming**: Unique filenames for security
- ✅ **File Validation**: MIME type and size validation
- ✅ **File Serving**: Direct file access via URL
- ✅ **File Listing**: List all uploaded files (for debugging)

## Endpoints

### 1. Upload Image
**POST** `/api/upload/image`

Uploads an image file and returns file information.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (required): Image file (JPEG, JPG, PNG)

**File Requirements:**
- **Supported formats**: JPEG, JPG, PNG
- **Maximum size**: 5MB
- **Field name**: `file`

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@your-image.jpg"
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
    "mimetype": "image/jpeg",
    "originalName": "your-image.jpg"
  },
  "message": "File uploaded successfully",
  "success": true
}
```

**Response Fields:**
- `filename`: Unique UUID filename with original extension
- `mimetype`: MIME type of the uploaded file
- `originalName`: Original filename provided by user

### 2. Serve File
**GET** `/api/upload/file`

Serves an uploaded file by filename.

**Query Parameters:**
- `file` (required): Filename to serve

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/upload/file?file=a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
```

**Response:**
- **Status**: 200 OK
- **Content-Type**: Based on file type (image/jpeg, image/png, etc.)
- **Body**: File binary data

**Headers:**
```
Content-Length: 12345
Content-Type: image/jpeg
Content-Disposition: inline; filename="a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
Cache-Control: public, max-age=31536000
```

**Note:** Files are served with proper MIME types for browser viewing. Images will display directly in the browser instead of downloading.

### 3. List Uploaded Files
**GET** `/api/upload/files`

Returns a list of all uploaded files (for debugging purposes).

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/upload/files
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "files": [
      {
        "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
        "path": "/api/upload/file?file=a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg"
      },
      {
        "filename": "b2c3d4e5-f6g7-8901-bcde-f23456789012.png",
        "path": "/api/upload/file?file=b2c3d4e5-f6g7-8901-bcde-f23456789012.png"
      }
    ]
  },
  "message": "Files retrieved successfully",
  "success": true
}
```

## Error Responses

### File Upload Errors

#### No File Uploaded (400)
```json
{
  "statusCode": 400,
  "message": "No file uploaded",
  "success": false
}
```

#### Invalid File Type (400)
```json
{
  "statusCode": 400,
  "message": "Only JPEG, JPG, and PNG files are allowed",
  "success": false
}
```

#### File Too Large (400)
```json
{
  "statusCode": 400,
  "message": "File size too large. Maximum size is 5MB",
  "success": false
}
```

### File Serving Errors

#### Missing File Parameter (400)
```json
{
  "statusCode": 400,
  "message": "File parameter is required",
  "success": false
}
```

#### File Not Found (404)
```json
{
  "statusCode": 404,
  "message": "File not found",
  "success": false
}
```

## File Storage

### Directory Structure
```
uploads/
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
├── b2c3d4e5-f6g7-8901-bcde-f23456789012.png
└── c3d4e5f6-g7h8-9012-cdef-345678901234.jpeg
```

### Naming Convention
- **Format**: `{UUID}.{original-extension}`
- **Example**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg`
- **Benefits**: 
  - Prevents filename conflicts
  - Enhances security (no predictable filenames)
  - Preserves original file extension

## Security Features

### File Validation
- **MIME Type Check**: Only allows image/jpeg, image/jpg, image/png
- **File Size Limit**: Maximum 5MB per file
- **Extension Preservation**: Maintains original file extension

### UUID Generation
- **Unique Names**: Each file gets a unique UUID
- **No Conflicts**: Eliminates filename collision issues
- **Security**: Prevents directory traversal and filename guessing

## Usage Examples

### Using curl

1. **Upload an image:**
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@path/to/your/image.jpg"
```

2. **Serve an uploaded file:**
```bash
curl -X GET "http://localhost:3000/api/upload/file?file=FILENAME.jpg" \
  -o downloaded-image.jpg
```

3. **List all uploaded files:**
```bash
curl -X GET http://localhost:3000/api/upload/files
```

### Using JavaScript/Fetch

```javascript
// Upload image
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const uploadResponse = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});

const uploadResult = await uploadResponse.json();
console.log('Uploaded filename:', uploadResult.data.filename);

// Serve file (for browser viewing)
const imageUrl = `/api/upload/file?file=${uploadResult.data.filename}`;
const img = document.createElement('img');
img.src = imageUrl;
document.body.appendChild(img);

// Or use directly in HTML
// <img src="/api/upload/file?file=FILENAME.jpg" alt="Uploaded Image">
```

### Using HTML Form

```html
<form action="/api/upload/image" method="post" enctype="multipart/form-data">
  <input type="file" name="file" accept="image/jpeg,image/jpg,image/png" required>
  <button type="submit">Upload Image</button>
</form>
```

## Integration with Recipe API

The upload API can be integrated with the Recipe API to handle recipe images:

1. **Upload image first:**
```bash
curl -X POST http://localhost:3000/api/upload/image \
  -F "file=@recipe-image.jpg"
```

2. **Use the returned filename in recipe creation:**
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Recipe",
    "ingredients": ["ingredient1", "ingredient2"],
    "instructions": "Cook the recipe...",
    "cookingTime": "30 minutes",
    "imageUrl": "http://localhost:3000/api/upload/file?file=RETURNED_FILENAME.jpg"
  }'
```

## Configuration

### File Size Limits
- **Default**: 5MB
- **Configurable**: Modify in `src/plugins/upload.plugin.ts`

### Allowed File Types
- **Current**: JPEG, JPG, PNG
- **Configurable**: Modify `allowedMimeTypes` array in upload plugin

### Storage Directory
- **Default**: `uploads/`
- **Configurable**: Modify `destination` in multer storage configuration

## Notes

- Files are stored in the `uploads/` directory relative to the project root
- Each uploaded file gets a unique UUID filename
- Original file extensions are preserved
- The API supports only image files (JPEG, JPG, PNG)
- Maximum file size is 5MB
- Files are served with appropriate MIME types
- The file listing endpoint is useful for debugging but should be disabled in production 