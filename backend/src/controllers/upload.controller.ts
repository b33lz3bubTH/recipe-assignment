import { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, getFileInfo, validateFileExists, UploadedFileInfo } from '../plugins/upload.plugin';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import fs from 'fs';
import path from 'path';

class UploadController {
  /**
   * Upload an image file
   */
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    // Use multer middleware with error handling
    uploadImage(req, res, async (err: any) => {
      try {
        if (err) {
          // Handle multer errors
          if (err instanceof multer.MulterError) {
            switch (err.code) {
              case 'LIMIT_FILE_SIZE':
                throw new ApiError(400, 'File size too large. Maximum size is 5MB');
              case 'LIMIT_FILE_COUNT':
                throw new ApiError(400, 'Too many files. Only one file allowed');
              default:
                throw new ApiError(400, `Upload error: ${err.message}`);
            }
          }
          
          // Handle other errors
          throw new ApiError(400, err.message || 'Upload failed');
        }

        // Validate that file was uploaded
        if (!req.file) {
          throw new ApiError(400, 'No file uploaded');
        }

        // Additional validation
        if (!req.file.filename || !req.file.mimetype || !req.file.originalname) {
          throw new ApiError(400, 'Invalid file information received');
        }

        // Validate file exists on disk
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadsDir, req.file.filename);
        
        if (!fs.existsSync(filePath)) {
          throw new ApiError(500, 'File was not saved properly');
        }

        // Get file info with validation
        const fileInfo: UploadedFileInfo = getFileInfo(req.file);

        res.status(200).json(
          new ApiResponse(200, fileInfo, 'File uploaded successfully')
        );
      } catch (error) {
        // Clean up any partially uploaded file
        if (req.file && req.file.filename) {
          try {
            const uploadsDir = path.join(process.cwd(), 'uploads');
            const filePath = path.join(uploadsDir, req.file.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
        
        // Re-throw the error to be handled by asyncHandler
        throw error;
      }
    });
  });

  /**
   * Serve uploaded files with security checks
   */
  serveFile = asyncHandler(async (req: Request, res: Response) => {
    const { file } = req.query;

    // Validate file parameter
    if (!file || typeof file !== 'string') {
      throw new ApiError(400, 'File parameter is required');
    }

    // Security check: prevent path traversal
    if (file.includes('..') || file.includes('/') || file.includes('\\')) {
      throw new ApiError(400, 'Invalid filename');
    }

    // Validate file exists
    if (!validateFileExists(file)) {
      throw new ApiError(404, 'File not found');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, file);

    try {
      // Get file stats
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      // Validate file size (prevent serving extremely large files)
      if (fileSize > 10 * 1024 * 1024) { // 10MB limit for serving
        throw new ApiError(400, 'File too large to serve');
      }

      // Determine MIME type based on file extension
      const ext = path.extname(file).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      // Set headers for browser viewing
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${file}"`);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

      // Stream the file with error handling
      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json(new ApiResponse(500, null, 'Error serving file'));
        }
      });

      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Error serving file');
    }
  });

  /**
   * Get list of uploaded files (optional - for debugging)
   */
  getUploadedFiles = asyncHandler(async (req: Request, res: Response) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    try {
      if (!fs.existsSync(uploadsDir)) {
        return res.status(200).json(
          new ApiResponse(200, { files: [] }, 'No files uploaded yet')
        );
      }

      const files = fs.readdirSync(uploadsDir);
      const fileList = files
        .filter(filename => {
          // Only include valid image files
          const ext = path.extname(filename).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map(filename => ({
          filename,
          path: `/api/upload/file?file=${encodeURIComponent(filename)}`
        }));

      res.status(200).json(
        new ApiResponse(200, { files: fileList }, 'Files retrieved successfully')
      );
    } catch (error) {
      throw new ApiError(500, 'Error retrieving files');
    }
  });
}

export const uploadController = new UploadController(); 