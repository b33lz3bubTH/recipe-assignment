import { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage, getFileInfo, UploadedFileInfo } from '../plugins/upload.plugin';
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
    // Use multer middleware
    uploadImage(req, res, async (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            throw new ApiError(400, 'File size too large. Maximum size is 5MB');
          }
          throw new ApiError(400, `Upload error: ${err.message}`);
        }
        throw new ApiError(400, err.message);
      }

      if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
      }

      const fileInfo: UploadedFileInfo = getFileInfo(req.file);

      res.status(200).json(
        new ApiResponse(200, fileInfo, 'File uploaded successfully')
      );
    });
  });

  /**
   * Serve uploaded files
   */
  serveFile = asyncHandler(async (req: Request, res: Response) => {
    const { file } = req.query;

    if (!file || typeof file !== 'string') {
      throw new ApiError(400, 'File parameter is required');
    }

    const filePath = path.join(__dirname, '../../uploads', file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new ApiError(404, 'File not found');
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

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

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });

  /**
   * Get list of uploaded files (optional - for debugging)
   */
  getUploadedFiles = asyncHandler(async (req: Request, res: Response) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json(
        new ApiResponse(200, { files: [] }, 'No files uploaded yet')
      );
    }

    const files = fs.readdirSync(uploadsDir);
    const fileList = files.map(filename => ({
      filename,
      path: `/api/upload/file?file=${filename}`
    }));

    res.status(200).json(
      new ApiResponse(200, { files: fileList }, 'Files retrieved successfully')
    );
  });
}

export const uploadController = new UploadController(); 