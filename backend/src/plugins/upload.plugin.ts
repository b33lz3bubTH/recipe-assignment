import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Request } from 'express';

// Define allowed file types
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with UUID
    const uniqueName = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueName}${fileExtension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Export the upload middleware
export const uploadImage = upload.single('file');

// Export file information interface
export interface UploadedFileInfo {
  filename: string;
  mimetype: string;
  originalName: string;
}

// Helper function to get file info
export const getFileInfo = (file: Express.Multer.File): UploadedFileInfo => {
  return {
    filename: file.filename,
    mimetype: file.mimetype,
    originalName: file.originalname
  };
}; 